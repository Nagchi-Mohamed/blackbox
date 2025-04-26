const mysql = require('mysql2/promise');
const logger = require('./logger');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brainymath',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create database if it doesn't exist
async function createDatabaseIfNotExists() {
  const tempPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'brainymath'}`);
    logger.info(`Database ${process.env.DB_NAME || 'brainymath'} created or already exists`);
  } catch (error) {
    logger.error('Error creating database:', error);
    throw error;
  } finally {
    await tempPool.end();
  }
}

// Test database connection and create tables
async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    await createDatabaseIfNotExists();
    
    const connection = await pool.getConnection();
    logger.info('Database connection established successfully');
    connection.release();
    
    // Create tables
    await createTables();
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  }
}

// Create tables
async function createTables() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'parent', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        course_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Create classrooms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classrooms (
        classroom_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        course_id INT NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(course_id),
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Create whiteboard_states table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS whiteboard_states (
        state_id INT PRIMARY KEY AUTO_INCREMENT,
        classroom_id INT NOT NULL,
        state_data JSON NOT NULL,
        thumbnail_path VARCHAR(255),
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Create enrollments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_enrollment (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
      )
    `);

    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Error creating tables:', error);
    throw error;
  }
}

const db = {
  query: async (sql, params) => {
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  execute: async (sql, params) => {
    const [result] = await pool.execute(sql, params);
    return result;
  },

  initializeDatabase
};

module.exports = db; 