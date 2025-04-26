const db = require('../db');
const bcrypt = require('bcrypt');

async function seedTestData() {
  try {
    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    await db.execute(
      `INSERT INTO users (email, password, username, role, first_name, last_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['test@example.com', hashedPassword, 'testuser', 'teacher', 'Test', 'User']
    );

    // Create test course
    const [user] = await db.query('SELECT user_id FROM users WHERE email = ?', ['test@example.com']);
    await db.execute(
      `INSERT INTO courses (title, description, created_by)
       VALUES (?, ?, ?)`,
      ['Test Course', 'This is a test course', user[0].user_id]
    );

    console.log('Test data seeded successfully');
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
}

seedTestData().catch(console.error); 