const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthorizedError } = require('../errors');
const bcrypt = require('bcrypt');
const pool = require('../utils/db');

const register = async (req, res) => {
  try {
    const { username, email, password, role, education_level } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    // Create user
    const user_id = await User.create({
      username,
      email,
      password,
      role
    });

    // Create user profile
    await User.createProfile(user_id, {
      education_level
    });

    // Generate JWT token
    const token = jwt.sign(
      { user_id, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          user_id,
          username,
          email,
          role
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = users[0];

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        username: user.username,
        user_type: user.user_type
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    
    if (!user) {
      throw new BadRequestError('User not found');
    }

    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile_pic_url: user.profile_pic_url,
          bio: user.bio,
          education_level: user.education_level,
          interests: user.interests,
          achievements: user.achievements
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
}; 