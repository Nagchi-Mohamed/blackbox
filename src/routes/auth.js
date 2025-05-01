const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Register route
router.post('/register', authController.register);

// Login route
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
});

// Apply to login route
router.post('/login', authLimiter, authController.login);

// Get current user
router.get('/me', auth, async (req, res, next) => {
  try {
    await authController.getUser(req, res);
  } catch (error) {
    next(error);
  }
});

// Password reset request
router.post('/reset-password', authController.requestPasswordReset);

// Password reset confirmation
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;