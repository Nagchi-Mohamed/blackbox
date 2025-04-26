const knex = require('knex');
const config = require('../config/database');

async function initializeDatabase() {
  const db = knex(config);

  try {
    // Run migrations
    await db.migrate.latest();
    console.log('Database migrations completed successfully');

    // Run seeds if needed
    if (process.env.NODE_ENV === 'development') {
      await db.seed.run();
      console.log('Database seeding completed successfully');
    }

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase
}; 