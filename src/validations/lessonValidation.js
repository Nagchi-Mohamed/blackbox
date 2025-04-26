const Joi = require('joi');
const { contentTypes } = require('../config/constants');

// Base lesson schema
const baseLessonSchema = Joi.object({
  module_id: Joi.number().integer().required().messages({
    'number.base': 'Module ID must be a number',
    'any.required': 'Module ID is required'
  }),
  title: Joi.string().max(100).required().messages({
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required'
  }),
  content_type: Joi.string().valid(...Object.values(contentTypes)).required().messages({
    'any.only': `Content type must be one of: ${Object.values(contentTypes).join(', ')}`,
    'any.required': 'Content type is required'
  }),
  content_text: Joi.when('content_type', {
    is: contentTypes.TEXT,
    then: Joi.string().required().messages({
      'string.empty': 'Content text cannot be empty for text lessons',
      'any.required': 'Content text is required for text lessons'
    }),
    otherwise: Joi.string().allow('').optional()
  }),
  duration_minutes: Joi.number().integer().min(1).max(600).required().messages({
    'number.base': 'Duration must be a number',
    'number.min': 'Duration must be at least 1 minute',
    'number.max': 'Duration cannot exceed 600 minutes (10 hours)',
    'any.required': 'Duration is required'
  }),
  is_free_preview: Joi.boolean().default(false).messages({
    'boolean.base': 'Free preview must be a boolean value'
  })
});

// Pagination schema
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  })
});

// Search and filter schema
const searchFilterSchema = Joi.object({
  search: Joi.string().allow('').max(100).messages({
    'string.max': 'Search query cannot exceed 100 characters'
  }),
  contentType: Joi.string().valid(...Object.values(contentTypes)).allow('').messages({
    'any.only': `Content type must be one of: ${Object.values(contentTypes).join(', ')}`
  }),
  isFreePreview: Joi.boolean().messages({
    'boolean.base': 'Free preview filter must be a boolean'
  })
});

// Sorting schema
const sortingSchema = Joi.object({
  sort: Joi.string()
    .pattern(/^([a-z_]+:(ASC|DESC),?)+$/)
    .default('sequence_order:ASC')
    .messages({
      'string.pattern.base': 'Sort must be in format "field:order,field:order"'
    })
});

// Combine all schemas
const listLessonsSchema = paginationSchema
  .concat(searchFilterSchema)
  .concat(sortingSchema);

// Schemas for specific operations
module.exports = {
  createLesson: baseLessonSchema,
  updateLesson: baseLessonSchema.keys({
    module_id: Joi.number().integer().optional(),
    title: Joi.string().max(100).optional(),
    content_type: Joi.string().valid(...Object.values(contentTypes)).optional(),
    duration_minutes: Joi.number().integer().min(1).max(600).optional(),
    is_free_preview: Joi.boolean().optional()
  }),
  reorderLessons: Joi.object({
    lesson_ids: Joi.array().items(
      Joi.number().integer()
    ).min(1).required().messages({
      'array.base': 'Lesson IDs must be an array',
      'array.min': 'At least one lesson ID is required',
      'any.required': 'Lesson IDs are required'
    })
  }),
  pagination: paginationSchema,
  listLessons: listLessonsSchema
}; 