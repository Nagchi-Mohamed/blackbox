const mongoose = require('mongoose');
const logger = require('./logger');
require('dotenv').config();

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brainymath', options);
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Initialize database
async function initializeDatabase() {
  try {
    await connectToDatabase();
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  }
}

const db = {
  connection: mongoose.connection,
  initializeDatabase
};

module.exports = db; 