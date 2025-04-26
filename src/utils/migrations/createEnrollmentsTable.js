const pool = require('../db');
const logger = require('../logger');

const createEnrollmentsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
        progress_percentage INT DEFAULT 0,
        last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (course_id) REFERENCES courses(course_id),
        UNIQUE KEY unique_enrollment (user_id, course_id)
      )
    `);

    logger.info('Enrollments table created successfully');
  } catch (error) {
    logger.error('Error creating enrollments table:', error);
    throw error;
  }
};

module.exports = createEnrollmentsTable; 