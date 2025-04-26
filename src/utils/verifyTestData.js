const pool = require('./db');

async function verifyTestData() {
  try {
    // Check users
    console.log('\nChecking users:');
    const [users] = await pool.query(
      'SELECT user_id, username FROM users WHERE username IN (?)',
      [['teacher1', 'student1', 'student2']]
    );
    console.log(users);

    // Check whiteboard states
    console.log('\nChecking whiteboard states:');
    const [states] = await pool.query(
      `SELECT ws.state_id, u.username, DATE(ws.created_at) as date 
       FROM whiteboard_states ws
       JOIN users u ON ws.created_by = u.user_id
       ORDER BY ws.created_at`
    );
    console.log(states);

    // Count states by user
    console.log('\nStates by user:');
    const [counts] = await pool.query(
      `SELECT u.username, COUNT(*) as count
       FROM whiteboard_states ws
       JOIN users u ON ws.created_by = u.user_id
       GROUP BY u.username`
    );
    console.log(counts);

    // Count states by date
    console.log('\nStates by date:');
    const [dates] = await pool.query(
      `SELECT DATE(ws.created_at) as date, COUNT(*) as count
       FROM whiteboard_states ws
       GROUP BY DATE(ws.created_at)
       ORDER BY date`
    );
    console.log(dates);

  } catch (error) {
    console.error('Error verifying test data:', error);
  } finally {
    await pool.end();
  }
}

verifyTestData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Verification failed:', error);
    process.exit(1);
  }); 