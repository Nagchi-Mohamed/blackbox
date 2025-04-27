const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // If err is not an instance of ApiError, convert it
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    err = new ApiError(statusCode, message, false);
  }

  const response = {
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(err.statusCode).json(response);
};

module.exports = errorHandler; 