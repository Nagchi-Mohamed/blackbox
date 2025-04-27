const Joi = require('joi');
const { AppError } = require('./errorHandler');

const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // include all errors
      allowUnknown: true, // ignore unknown props
      stripUnknown: true // remove unknown props
    };

    const validateData = {};
    if (schema.body) validateData.body = req.body;
    if (schema.query) validateData.query = req.query;
    if (schema.params) validateData.params = req.params;

    const { error, value } = Joi.object(schema).validate(validateData, validationOptions);
    
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new AppError(400, errorMessage));
    }

    // Replace request data with validated data
    if (schema.body) req.body = value.body;
    if (schema.query) req.query = value.query;
    if (schema.params) req.params = value.params;

    return next();
  };
};

module.exports = validate; 