const request = require('supertest');
const app = require('../server');
const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  createTestUser: async (role = 'student') => {
    const username = `test_${role}_${Date.now()}`;
    const email = `${username}@test.com`;
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    const token = jwt.sign(
      { id: result.insertId, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      userId: result.insertId,
      token,
      username,
      email
    };
  },

  createTestCourse: async (instructorId) => {
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, created_by) VALUES (?, ?, ?)',
      [`Test Course ${Date.now()}`, 'Test course description', instructorId]
    );

    return {
      courseId: result.insertId
    };
  },

  cleanupTestData: async () => {
    await pool.query('DELETE FROM enrollments');
    await pool.query('DELETE FROM courses');
    await pool.query('DELETE FROM users');
  }
}; 