const pool = require('../../config/database');

const addServiceTables = async () => {
  const connection = await pool.getConnection();
  try {
    // Content and localization tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS content (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        type ENUM('lesson', 'exercise', 'quiz', 'resource') NOT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS localized_content (
        content_id INT,
        language_code VARCHAR(5) NOT NULL,
        translated_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (content_id, language_code),
        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      )
    `);

    // User preferences table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INT PRIMARY KEY,
        dark_mode BOOLEAN DEFAULT false,
        language_preference VARCHAR(5) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    // Classroom and breakout rooms tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS classrooms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        course_id INT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(course_id),
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS breakout_rooms (
        id INT PRIMARY KEY AUTO_INCREMENT,
        classroom_id INT,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
      )
    `);

    // Forum tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS forum_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INT,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (category_id) REFERENCES forum_categories(id)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS forum_comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL,
        user_id INT,
        post_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE
      )
    `);

    // Analytics tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        activity_type VARCHAR(50) NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )
    `);

    console.log('Service tables created successfully');
  } catch (error) {
    console.error('Error creating service tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { addServiceTables }; 