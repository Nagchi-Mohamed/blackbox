const pool = require('../utils/db');

class Classroom {
  static async create({
    creator_id,
    name,
    description,
    schedule,
    max_participants = 50
  }) {
    const [result] = await pool.query(
      `INSERT INTO classrooms 
       (creator_id, name, description, schedule, max_participants)
       VALUES (?, ?, ?, ?, ?)`,
      [creator_id, name, description, schedule, max_participants]
    );
    return result.insertId;
  }

  static async findById(classroom_id) {
    const [rows] = await pool.query(
      `SELECT c.*, u.username as creator_name 
       FROM classrooms c
       JOIN users u ON c.creator_id = u.user_id
       WHERE c.classroom_id = ?`,
      [classroom_id]
    );
    return rows[0];
  }

  static async update(classroom_id, updates) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    
    params.push(classroom_id);
    
    await pool.query(
      `UPDATE classrooms SET ${fields.join(', ')} WHERE classroom_id = ?`,
      params
    );
  }

  static async listUpcoming(limit = 10) {
    const [rows] = await pool.query(
      `SELECT c.*, u.username as creator_name 
       FROM classrooms c
       JOIN users u ON c.creator_id = u.user_id
       WHERE c.status = 'scheduled' AND c.schedule > NOW()
       ORDER BY c.schedule ASC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  static async addParticipant(classroom_id, user_id, role = 'participant') {
    const [result] = await pool.query(
      `INSERT INTO classroom_participants 
       (classroom_id, user_id, role)
       VALUES (?, ?, ?)`,
      [classroom_id, user_id, role]
    );
    return result.insertId;
  }

  static async getParticipants(classroom_id) {
    const [rows] = await pool.query(
      `SELECT cp.*, u.username, u.profile_pic_url 
       FROM classroom_participants cp
       JOIN users u ON cp.user_id = u.user_id
       WHERE cp.classroom_id = ?`,
      [classroom_id]
    );
    return rows;
  }

  static async startSession(classroom_id) {
    await pool.query(
      `UPDATE classrooms SET status = 'live' WHERE classroom_id = ?`,
      [classroom_id]
    );
  }

  static async endSession(classroom_id) {
    await pool.query(
      `UPDATE classrooms SET status = 'ended' WHERE classroom_id = ?`,
      [classroom_id]
    );
  }
}

module.exports = Classroom; 