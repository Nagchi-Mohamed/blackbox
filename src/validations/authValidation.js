const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username cannot exceed 50 characters',
      'any.required': 'Username is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required'
    }),
  
  role: Joi.string()
    .valid('student', 'teacher', 'admin')
    .default('student')
    .messages({
      'any.only': 'Role must be one of: student, teacher, admin'
    }),
  
  education_level: Joi.string()
    .valid('primary', 'secondary', 'college', 'university')
    .required()
    .messages({
      'any.only': 'Education level must be one of: primary, secondary, college, university',
      'any.required': 'Education level is required'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  registerSchema,
  loginSchema
}; 