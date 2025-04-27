const Joi = require('joi');

const userValidation = {
  // POST /api/users
  createUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().min(2).max(50).required(),
      role: Joi.string().valid('user', 'admin').default('user')
    })
  },

  // PATCH /api/users/:id
  updateUser: {
    params: Joi.object({
      id: Joi.string().required()
    }),
    body: Joi.object({
      email: Joi.string().email(),
      name: Joi.string().min(2).max(50),
      role: Joi.string().valid('user', 'admin')
    }).min(1)
  },

  // GET /api/users/:id
  getUser: {
    params: Joi.object({
      id: Joi.string().required()
    })
  },

  // POST /api/auth/login
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  },

  // POST /api/auth/register
  register: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().min(2).max(50).required()
    })
  }
};

module.exports = userValidation; 