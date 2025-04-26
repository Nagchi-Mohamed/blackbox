const { pool } = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ValidationError } = require('../utils/errors');

class UserService {
  async createUser(userData) {
    const { username, email, password, role } = userData;
    
    // Validate input
    if (!username || !email || !password || !role) {
      throw new ValidationError('Missing required fields');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    return { id: result.insertId, username, email, role };
  }

  async authenticateUser(email, password) {
    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = users[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  async getUserPreferences(userId) {
    const [preferences] = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    return preferences[0] || {
      dark_mode: false,
      language_preference: 'en'
    };
  }

  async updateUserPreferences(userId, preferences) {
    const { dark_mode, language_preference } = preferences;

    await pool.query(
      `INSERT INTO user_preferences (user_id, dark_mode, language_preference)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       dark_mode = VALUES(dark_mode),
       language_preference = VALUES(language_preference)`,
      [userId, dark_mode, language_preference]
    );

    return this.getUserPreferences(userId);
  }
}

module.exports = new UserService(); 