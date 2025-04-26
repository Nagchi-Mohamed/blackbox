const pool = require('../db');
const logger = require('../logger');

const createCoursesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        course_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    logger.info('Courses table created successfully');
  } catch (error) {
    logger.error('Error creating courses table:', error);
    throw error;
  }
};

module.exports = createCoursesTable; 