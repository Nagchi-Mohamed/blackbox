const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/db');
const logger = require('../utils/logger');
const User = require('../models/User'); // Add this import
const { BadRequestError, UnauthorizedError } = require('../errors'); // Add error imports

exports.register = async (req, res, next) => {
  try {
    // Registration logic here
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
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Login logic here
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
    next(error);
  }
};

exports.getUser = async (req, res) => {
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