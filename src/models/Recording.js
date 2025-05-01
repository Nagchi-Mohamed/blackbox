const db = require('../utils/db');

class Recording {
  static async findAll() {
    const recordings = await db.query(`
      SELECT 
        r.recording_id,
        r.title,
        r.description,
        r.classroom_id,
        r.created_at,
        r.updated_at,
        u.username as created_by_name
      FROM recordings r
      JOIN users u ON r.created_by = u.user_id
      ORDER BY r.created_at DESC
    `);
    return recordings;
  }

  static async findById(id) {
    const recordings = await db.query(`
      SELECT 
        r.recording_id,
        r.title,
        r.description,
        r.classroom_id,
        r.created_at,
        r.updated_at,
        u.username as created_by_name
      FROM recordings r
      JOIN users u ON r.created_by = u.user_id
      WHERE r.recording_id = ?
    `, [id]);
    return recordings[0] || null;
  }

  static async create({ title, description, created_by }) {
    const result = await db.execute(
      `INSERT INTO recordings (title, description, created_by)
       VALUES (?, ?, ?)`,
      [title, description, created_by]
    );
    return this.findById(result.insertId);
  }

  static async update(id, { title, description }) {
    await db.execute(
      `UPDATE recordings 
       SET title = ?, description = ?
       WHERE recording_id = ?`,
      [title, description, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.execute('DELETE FROM recordings WHERE recording_id = ?', [id]);
  }
}

module.exports = Recording; 