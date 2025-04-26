const Joi = require('joi');

const whiteboardSchema = Joi.object({
  state_data: Joi.object().required(),
  thumbnail_path: Joi.string()
});

const searchSchema = Joi.object({
  user_id: Joi.number().integer(),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')),
  q: Joi.string().min(1).max(100),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100)
});

module.exports = {
  whiteboardSchema,
  searchSchema
}; 