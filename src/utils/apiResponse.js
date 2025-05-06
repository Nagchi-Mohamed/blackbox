class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(data, message) {
    return new ApiResponse(200, data, message);
  }

  static created(data, message) {
    return new ApiResponse(201, data, message);
  }

  static noContent(message) {
    return new ApiResponse(204, null, message);
  }

  static badRequest(message, errors = []) {
    return new ApiResponse(400, { errors }, message);
  }

  static unauthorized(message) {
    return new ApiResponse(401, null, message);
  }

  static forbidden(message) {
    return new ApiResponse(403, null, message);
  }

  static notFound(message) {
    return new ApiResponse(404, null, message);
  }

  static conflict(message) {
    return new ApiResponse(409, null, message);
  }

  static internalError(message) {
    return new ApiResponse(500, null, message);
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data
    };
  }
}

module.exports = ApiResponse;