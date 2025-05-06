const jwt = require('jsonwebtoken');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');
const { pool } = require('../config/database');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Auth middleware token:', token);
        if (!token) {
            return res.status(401).json({ 
                error: { code: 'missing-token', message: 'Authentication required' }
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware decoded token:', decoded);
        const user = await User.findById(decoded.userId);
        console.log('Auth middleware user found:', user);

        if (!user) {
            return res.status(401).json({ 
                error: { code: 'invalid-token', message: 'User not found' }
            });
        }

        if (!user.active) {
            console.log('Auth middleware user inactive:', user);
            return res.status(401).json({ 
                error: { code: 'inactive-account', message: 'User account is inactive' }
            });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ 
            error: { code: 'auth-failed', message: 'Invalid authentication token' }
        });
    }
};

// Role-based authorization middleware
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

const isTeacher = (req, res, next) => {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Teacher access required' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

const isStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Student access required' });
    }
    next();
};

const isParent = (req, res, next) => {
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Parent access required' });
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
