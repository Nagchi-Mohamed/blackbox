const { connectToDatabase } = require('../utils/db');
const { User, Class } = require('./schema');

async function initializeDatabase() {
  try {
    await connectToDatabase();
    
    // Create initial data if needed
    // await User.create(...);
    // await Class.create(...);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;