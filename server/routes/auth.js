const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    console.log('Password valid:', validPassword);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated for user:', username);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add route to get current user info
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('No token provided in /auth/me request');
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.replace('Bearer ', '');
  console.log('Token received in /auth/me:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token in /auth/me:', decoded);
    const user = await User.findById(decoded.id, '-passwordHash');
    if (!user) {
      console.error('User not found for token in /auth/me request');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Token verification failed in /auth/me:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
