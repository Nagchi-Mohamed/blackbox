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

async function createTestClassroom(creator_id) {
  const [result] = await pool.query(
    `INSERT INTO classrooms (name, description, creator_id, status)
     VALUES (?, ?, ?, ?)`,
    ['Test Classroom', 'Test classroom for whiteboard history', creator_id, 'live']
  );
  return result.insertId;
}

function generateWhiteboardState(content) {
  const baseState = {
    version: "5.3.0",
    objects: []
  };

  switch(content.type) {
    case 'text':
      baseState.objects.push({
        type: 'text',
        version: "5.3.0",
        originX: 'left',
        originY: 'top',
        left: 100,
        top: 100,
        width: 200,
        height: 30,
        fill: '#000000',
        stroke: null,
        text: content.text,
        fontSize: 20,
        fontFamily: 'Arial'
      });
      break;
    case 'shape':
      baseState.objects.push({
        type: 'rect',
        version: "5.3.0",
        originX: 'left',
        originY: 'top',
        left: 200,
        top: 200,
        width: 100,
        height: 100,
        fill: content.color,
        stroke: null
      });
      break;
    case 'drawing':
      baseState.objects.push({
        type: 'path',
        version: "5.3.0",
        originX: 'left',
        originY: 'top',
        left: 100,
        top: 100,
        path: [['M', 100, 100], ['L', 200, 200]],
        stroke: '#000000',
        strokeWidth: 2,
        fill: ''
      });
      break;
  }

  return JSON.stringify(baseState);
}

async function createTestStates(classroom_id, users) {
  const contents = [
    { type: 'text', text: 'Sample Text 1' },
    { type: 'shape', color: '#FF0000' },
    { type: 'drawing', path: 'M 100 100 L 200 200' },
    { type: 'text', text: 'Sample Text 2' },
    { type: 'shape', color: '#00FF00' }
  ];

  const dates = [
    '2024-01-15',
    '2024-01-16',
    '2024-01-16',
    '2024-01-17',
    '2024-01-17'
  ];

  for (let i = 0; i < contents.length; i++) {
    const state_data = generateWhiteboardState(contents[i]);
    const user = users[i % users.length];
    const created_at = dates[i];

    await pool.query(
      `INSERT INTO whiteboard_states 
       (classroom_id, state_data, created_by, created_at)
       VALUES (?, ?, ?, ?)`,
      [classroom_id, state_data, user.user_id, created_at]
    );
  }
}

async function seedTestData() {
  try {
    console.log('Creating test users...');
    const [users] = await createTestUsers();
    
    console.log('Creating test classroom...');
    const teacher = users.find(u => u.username === 'teacher1');
    const classroom_id = await createTestClassroom(teacher.user_id);
    
    console.log('Creating test whiteboard states...');
    await createTestStates(classroom_id, users);
    
    console.log('Test data seeded successfully!');
    console.log('Classroom ID:', classroom_id);
    console.log('Test Users:', users.map(u => u.username).join(', '));
    
    return { classroom_id, users };
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