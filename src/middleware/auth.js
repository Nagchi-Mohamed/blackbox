const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');
const { pool } = require('../config/database');

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

auth.hasRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    next();
  };
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new UnauthorizedError('Unauthorized access'));
    }

    next();
  };
};

// Role-specific middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new UnauthorizedError('Admin access required'));
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (!req.user || !['teacher', 'admin'].includes(req.user.role)) {
    return next(new UnauthorizedError('Teacher access required'));
  }
  next();
};

const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return next(new UnauthorizedError('Student access required'));
  }
  next();
};

const isParent = (req, res, next) => {
  if (!req.user || req.user.role !== 'parent') {
    return next(new UnauthorizedError('Parent access required'));
  }
  next();
};

module.exports = {
  auth,
  authorize,
  isAdmin,
  isTeacher,
  isStudent,
  isParent
}; 