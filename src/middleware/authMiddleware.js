const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

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

module.exports = {
  auth,
  authorize,
  isAdmin,
  isTeacher,
  isStudent
}; 