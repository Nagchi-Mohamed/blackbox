const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { auth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Improved error handling for registration
router.post('/register', async (req, res, next) => {
  try {
    // Assuming authController.register is still valid
    const authController = require('../controllers/authController');
    await authController.register(req, res);
  } catch (error) {
    next(error);
  }
});

// Enhanced login with rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    console.log('Login attempt for username:', username);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', validPassword);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Secure current user endpoint
router.get('/me', auth, async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    console.log('GET /me route accessed, user:', req.user);
    const authController = require('../controllers/authController');
    const user = await authController.getUser(req);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Password reset with better error handling
router.post('/reset-password', async (req, res, next) => {
  try {
    const authController = require('../controllers/authController');
    await authController.requestPasswordReset(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const authController = require('../controllers/authController');
    await authController.resetPassword(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
