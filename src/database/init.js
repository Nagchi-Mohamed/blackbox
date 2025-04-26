const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create courses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        course_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Create enrollments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enrollments (
        enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        course_id INT,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (course_id) REFERENCES courses(course_id),
        UNIQUE KEY unique_enrollment (user_id, course_id)
      )
    `);

    // Create whiteboard_states table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS whiteboard_states (
        state_id INT PRIMARY KEY AUTO_INCREMENT,
        classroom_id INT NOT NULL,
        state_data JSON NOT NULL,
        thumbnail_path VARCHAR(255),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Create recordings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS recordings (
        recording_id INT PRIMARY KEY AUTO_INCREMENT,
        room_id INT NOT NULL,
        file_path VARCHAR(255) NOT NULL,
        duration INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Create progress_records table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS progress_records (
        record_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        concept VARCHAR(100) NOT NULL,
        mastery DECIMAL(3,2) NOT NULL,
        attempts INT DEFAULT 0,
        successes INT DEFAULT 0,
        time_spent INT DEFAULT 0,
        assessment_type ENUM('practice', 'quiz', 'test', 'assignment') DEFAULT 'practice',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(user_id),
        INDEX idx_student_concept (student_id, concept),
        INDEX idx_created_at (created_at)
      )
    `);

    // Create interventions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS interventions (
        intervention_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        type ENUM('tutoring', 'peer_learning', 'resource_change', 'parent_meeting') NOT NULL,
        status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(user_id),
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    logger.info('Database tables initialized successfully');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

module.exports = initializeDatabase; 