const pool = require('../utils/db');
const bcrypt = require('bcrypt');

class User {
  static async create({
    username,
    email,
    password,
    role = 'student',
    profile_pic_url = null
  }) {
    const password_hash = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, role, profile_pic_url)
       VALUES (?, ?, ?, ?, ?)`,
      [username, email, password_hash, role, profile_pic_url]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(user_id) {
    const [rows] = await pool.query(
      `SELECT u.*, p.* 
       FROM users u
       LEFT JOIN user_profiles p ON u.user_id = p.user_id
       WHERE u.user_id = ?`,
      [user_id]
    );
    return rows[0];
  }

  static async update(user_id, updates) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'password') {
        const password_hash = await bcrypt.hash(value, 10);
        fields.push('password_hash = ?');
        params.push(password_hash);
      } else {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    params.push(user_id);
    
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
      params
    );
  }

  static async createProfile(user_id, {
    bio = '',
    education_level,
    interests = '',
    achievements = ''
  }) {
    const [result] = await pool.query(
      `INSERT INTO user_profiles (user_id, bio, education_level, interests, achievements)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, bio, education_level, interests, achievements]
    );
    return result.insertId;
  }

  static async updateProfile(user_id, updates) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    
    params.push(user_id);
    
    await pool.query(
      `UPDATE user_profiles SET ${fields.join(', ')} WHERE user_id = ?`,
      params
    );
  }

  static async search(query) {
    const [rows] = await pool.query(
      `SELECT u.*, p.* 
       FROM users u
       LEFT JOIN user_profiles p ON u.user_id = p.user_id
       WHERE u.username LIKE ? OR u.email LIKE ? OR p.bio LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows;
  }

  static async verifyPassword(password, password_hash) {
    return bcrypt.compare(password, password_hash);
  }
}

module.exports = User; 