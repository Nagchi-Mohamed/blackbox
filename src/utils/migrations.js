const pool = require('../config/database');
const { addServiceTables } = require('./migrations/v2_add_services');

const dropTables = async () => {
  const connection = await pool.getConnection();
  try {
    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop tables in reverse order of dependencies
    await connection.query('DROP TABLE IF EXISTS user_activity');
    await connection.query('DROP TABLE IF EXISTS forum_comments');
    await connection.query('DROP TABLE IF EXISTS forum_posts');
    await connection.query('DROP TABLE IF EXISTS forum_categories');
    await connection.query('DROP TABLE IF EXISTS breakout_rooms');
    await connection.query('DROP TABLE IF EXISTS classrooms');
    await connection.query('DROP TABLE IF EXISTS user_preferences');
    await connection.query('DROP TABLE IF EXISTS localized_content');
    await connection.query('DROP TABLE IF EXISTS content');
    await connection.query('DROP TABLE IF EXISTS interventions');
    await connection.query('DROP TABLE IF EXISTS recordings');
    await connection.query('DROP TABLE IF EXISTS whiteboard_states');
    await connection.query('DROP TABLE IF EXISTS enrollments');
    await connection.query('DROP TABLE IF EXISTS courses');
    await connection.query('DROP TABLE IF EXISTS users');

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

const createTables = async () => {
  const connection = await pool.getConnection();
  try {
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'parent', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Courses table
    await connection.query(`
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

    // Enrollments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT,
        user_id INT,
        role ENUM('student', 'teacher') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(course_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    // Whiteboard states table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS whiteboard_states (
        state_id INT PRIMARY KEY AUTO_INCREMENT,
        state_data JSON,
        thumbnail_path VARCHAR(255),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Recordings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recordings (
        recording_id INT PRIMARY KEY AUTO_INCREMENT,
        file_path VARCHAR(255) NOT NULL,
        duration INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    // Interventions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS interventions (
        intervention_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT,
        teacher_id INT,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        status ENUM('pending', 'in_progress', 'completed') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(user_id),
        FOREIGN KEY (teacher_id) REFERENCES users(user_id)
      )
    `);

    // Add service tables
    await addServiceTables();

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

const initializeDatabase = async () => {
  await dropTables();
  await createTables();
};

module.exports = { createTables, dropTables, initializeDatabase }; 