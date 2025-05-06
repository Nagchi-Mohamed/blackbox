const { pool } = require('../utils/db');

class SessionService {
  async createSession(userId, ipAddress, userAgent) {
    const [result] = await pool.query(
      'INSERT INTO sessions (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
      [userId, ipAddress, userAgent]
    );
    return result.insertId;
  }

  async endSession(sessionId) {
    await pool.query(
      'UPDATE sessions SET ended_at = NOW() WHERE session_id = ?',
      [sessionId]
    );
  }

  async getUserSessions(userId) {
    const [sessions] = await pool.query(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return sessions;
  }
}

module.exports = new SessionService();