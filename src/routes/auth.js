const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');

// Register new user
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

// Login user
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

// Get current user
router.get(
  '/me',
  auth,
  authController.getMe
);

module.exports = router; 