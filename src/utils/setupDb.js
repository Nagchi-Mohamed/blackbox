const fs = require('fs').promises;
const path = require('path');
const { connectDb } = require('../db/connection');
const logger = require('../config/logger');

const REQUIRED_DIRECTORIES = ['logs', 'temp', 'uploads'];

async function createRequiredDirectories() {
  try {
    await Promise.all(
      REQUIRED_DIRECTORIES.map(async (dir) => {
        const dirPath = path.join(process.cwd(), dir);
        await fs.mkdir(dirPath, { recursive: true });
        logger.info(`Created directory: ${dirPath}`);
      })
    );
  } catch (error) {
    logger.error('Error creating directories:', error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    const db = await connectDb();
    logger.info('Database connected successfully');
    return db;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

async function setup() {
  try {
    await createRequiredDirectories();
    await initializeDatabase();
    logger.info('Setup completed successfully');
  } catch (error) {
    logger.error('Setup failed:', error);
    process.exit(1);
  }
}

module.exports = {
  setup,
  createRequiredDirectories,
  initializeDatabase
}; 