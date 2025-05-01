const pool = require('./db');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  const users = [
    { username: 'teacher1', email: 'teacher1@test.com', password: 'password123', user_type: 'teacher' },
    { username: 'student1', email: 'student1@test.com', password: 'password123', user_type: 'student' },
    { username: 'student2', email: 'student2@test.com', password: 'password123', user_type: 'student' }
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await pool.query(
      `INSERT INTO users (username, email, password, user_type) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       email = VALUES(email), password = VALUES(password)`,
      [user.username, user.email, hashedPassword, user.user_type]
    );
  }

  return await pool.query('SELECT user_id, username FROM users WHERE username IN (?)', 
    [users.map(u => u.username)]
  );
}

async function seedTestData() {
  try {
    console.log('Creating test users...');
    const [users] = await createTestUsers();
    
    console.log('Test data seeded successfully!');
    console.log('Test Users:', users.map(u => u.username).join(', '));
    
    return { users };
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
