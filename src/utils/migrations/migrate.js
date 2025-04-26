const pool = require('../db');
const logger = require('../logger');
const createCoursesTable = require('./createCoursesTable');
const createEnrollmentsTable = require('./createEnrollmentsTable');

const runMigrations = async () => {
  try {
    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get executed migrations
    const [executedMigrations] = await pool.query('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(m => m.name);

    // Define migrations to run
    const migrations = [
      { name: 'createCoursesTable', fn: createCoursesTable },
      { name: 'createEnrollmentsTable', fn: createEnrollmentsTable }
    ];

    // Run pending migrations
    for (const migration of migrations) {
      if (!executedMigrationNames.includes(migration.name)) {
        logger.info(`Running migration: ${migration.name}`);
        await migration.fn();
        await pool.query('INSERT INTO migrations (name) VALUES (?)', [migration.name]);
        logger.info(`Completed migration: ${migration.name}`);
      }
    }

    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration error:', error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations; 