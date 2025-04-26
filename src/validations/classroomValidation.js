const Joi = require('joi');

const classroomSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Classroom name is required',
      'string.min': 'Classroom name must be at least 5 characters',
      'string.max': 'Classroom name cannot exceed 100 characters',
      'any.required': 'Classroom name is required'
    }),
  
  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Description cannot exceed 500 characters'
    }),
  
  schedule: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Please provide a valid date',
      'date.greater': 'Schedule must be in the future',
      'any.required': 'Schedule is required'
    }),
  
  max_participants: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
    .messages({
      'number.base': 'Must be a valid number',
      'number.min': 'Minimum 1 participant',
      'number.max': 'Maximum 100 participants'
    })
});

module.exports = {
  classroomSchema
}; 