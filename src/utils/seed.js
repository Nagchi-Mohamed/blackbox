const { pool } = require('./db');
const bcrypt = require('bcrypt');

const seedData = async () => {
  const connection = await pool.getConnection();
  try {
    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await connection.query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES 
        ('admin', 'admin@brainymath.com', ?, 'admin'),
        ('teacher1', 'teacher1@brainymath.com', ?, 'teacher'),
        ('student1', 'student1@brainymath.com', ?, 'student'),
        ('parent1', 'parent1@brainymath.com', ?, 'parent')
    `, [hashedPassword, hashedPassword, hashedPassword, hashedPassword]);

    // Create test courses
    await connection.query(`
      INSERT INTO courses (title, description, created_by)
      VALUES 
        ('Mathematics 101', 'Introduction to basic mathematics', 2),
        ('Advanced Algebra', 'Advanced algebraic concepts', 2)
    `);

    // Create test enrollments
    await connection.query(`
      INSERT INTO enrollments (course_id, user_id, role)
      VALUES 
        (1, 3, 'student'),
        (2, 3, 'student')
    `);

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { seedData }; 