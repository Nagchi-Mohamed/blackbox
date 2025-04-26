const { AppError } = require('../errors');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        details: err.details
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      }
    });
  }

  // Handle database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: {
        message: 'Duplicate entry',
        code: 'DUPLICATE_ENTRY'
      }
    });
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({
      error: {
        message: 'Database table does not exist',
        code: 'DB_TABLE_MISSING'
      }
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.details
      }
    });
  }

  // Default error
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
};

module.exports = errorHandler; 