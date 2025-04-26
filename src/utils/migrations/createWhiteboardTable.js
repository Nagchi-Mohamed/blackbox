const pool = require('../db');

async function createWhiteboardTable() {
  try {
    // Verify database connection
    await pool.query('SELECT 1');
    console.log('Database connection verified');

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('student', 'teacher', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Successfully created users table');

    // Create classrooms table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS classrooms (
        classroom_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        creator_id INT NOT NULL,
        status ENUM('draft', 'live', 'ended') NOT NULL DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(user_id)
      )
    `);
    console.log('Successfully created classrooms table');

    // Create whiteboard_states table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS whiteboard_states (
        state_id INT PRIMARY KEY AUTO_INCREMENT,
        classroom_id INT NOT NULL,
        state_data LONGTEXT NOT NULL,
        thumbnail_path VARCHAR(255),
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )
    `);
    console.log('Successfully created whiteboard_states table');

    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_whiteboard_classroom 
      ON whiteboard_states(classroom_id)
    `);
    console.log('Successfully created index on classroom_id');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
createWhiteboardTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 