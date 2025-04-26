const pool = require('../db');

async function addThumbnailPathColumn() {
  try {
    // Verify database connection
    await pool.query('SELECT 1');
    console.log('Database connection verified');

    // Add the column
    await pool.query(`
      ALTER TABLE whiteboard_states 
      ADD COLUMN IF NOT EXISTS thumbnail_path VARCHAR(255)
    `);
    console.log('Successfully added thumbnail_path column');

    // Verify the column was added
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'whiteboard_states' 
      AND COLUMN_NAME = 'thumbnail_path'
    `);
    
    if (columns.length > 0) {
      console.log('Verified thumbnail_path column exists');
    } else {
      throw new Error('Column was not added successfully');
    }
  } catch (error) {
    console.error('Error adding thumbnail_path column:', error);
    throw error;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
addThumbnailPathColumn()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  }); 