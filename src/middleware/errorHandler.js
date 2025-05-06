const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  // Standardized error logging
  logger.error({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user?.id || 'anonymous',
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Handle operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Error type handlers
  const errorHandlers = {
    ValidationError: () => ({
      status: 400,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    }),
    CastError: () => ({
      status: 400,
      message: 'Invalid ID format'
    }),
    JsonWebTokenError: () => ({
      status: 401,
      message: 'Invalid token'
    }),
    TokenExpiredError: () => ({
      status: 401,
      message: 'Token expired'
    }),
    11000: () => ({
      status: 400,
      message: 'Duplicate field value entered',
      field: err.keyValue ? Object.keys(err.keyValue)[0] : undefined
    }),
    TooManyRequestsError: () => ({
      status: 429,
      message: 'Too many requests, please try again later',
      retryAfter: req.rateLimit?.resetTime
    }),
    MongoNetworkError: () => ({
      status: 503,
      message: 'Database connection error'
    }),
    RequestValidationError: () => ({
      status: 422,
      message: 'Invalid request data'
    }),
    MulterError: () => ({
      status: 400,
      message: 'File upload error',
      details: err.message
    }),
    FileSizeError: () => ({
      status: 413,
      message: 'File size exceeds limit',
      limit: `${err.limit / 1024 / 1024}MB`
    }),
    ForbiddenError: () => ({
      status: 403,
      message: 'Insufficient permissions'
    }),
    UnauthorizedError: () => ({
      status: 401,
      message: 'Authentication required'
    }),
    MaintenanceError: () => ({
      status: 503,
      message: 'Service temporarily unavailable for maintenance',
      estimatedRestoration: err.estimatedRestoration
    })
  };

  // Handle known errors
  const handler = errorHandlers[err.name] || errorHandlers[err.code];
  if (handler) {
    const { status, ...response } = handler();
    return res.status(status).json(response);
  }

  // Unknown error (production vs development)
  const response = {
    status: 'error',
    message: 'Something went wrong'
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = err;
    response.stack = err.stack;
  }

  res.status(500).json(response);
};

module.exports = errorHandler;