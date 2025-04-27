const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthorizedError } = require('../errors');

const register = async (req, res) => {
  try {
    const { username, email, password, role, first_name, last_name } = req.body;

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
      role,
      first_name,
      last_name
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
          role,
          first_name,
          last_name
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
    const user = await User.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check password
    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
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
          first_name: user.first_name,
          last_name: user.last_name
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