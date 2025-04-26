const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
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
  authenticate,
  authorize,
  isAdmin,
  isTeacher,
  isStudent,
  isParent
}; 