const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiting for security endpoints
const historyRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { 
    error: { 
      code: 'rate-limited', 
      message: 'Too many requests, please try again later' 
    } 
  }
});

const recoveryRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { 
    error: { 
      code: 'rate-limited', 
      message: 'Too many recovery attempts, please try again later' 
    } 
  }
});

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User not authenticated'));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Unauthorized access'));
    }

    next();
  };
};

// Role-specific middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (!req.user || !['teacher', 'admin'].includes(req.user.role)) {
    return next(new ApiError(403, 'Teacher access required'));
  }
  next();
};

const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return next(new ApiError(403, 'Student access required'));
  }
  next();
};

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: { code: 'missing-token', message: 'Authentication required' }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });
    
    if (!user) {
      return res.status(401).json({ 
        error: { code: 'invalid-token', message: 'Invalid authentication' }
      });
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ 
      error: { code: 'auth-failed', message: 'Please authenticate' }
    });
  }
};

exports.authorize = (role) => {
  return (req, res, next) => {
    if (req.user.roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ 
        error: { code: 'forbidden', message: 'Insufficient permissions' }
      });
    }
  };
};

exports.historyRateLimit = historyRateLimit;
exports.recoveryRateLimit = recoveryRateLimit;

module.exports = {
  auth,
  authorize,
  isAdmin,
  isTeacher,
  isStudent
}; 