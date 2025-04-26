const db = require('../utils/db');
const logger = require('../utils/logger');

class Course {
  static async findAll(limit = 10, offset = 0) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, u.username as creator_username 
         FROM courses c 
         JOIN users u ON c.created_by = u.user_id 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      logger.error('Error in Course.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query(
        `SELECT c.*, u.username as creator_username 
         FROM courses c 
         JOIN users u ON c.created_by = u.user_id 
         WHERE c.course_id = ?`,
        [id]
      );
      return rows[0];
    } catch (error) {
      logger.error('Error in Course.findById:', error);
      throw error;
    }
  }

  static async create(courseData) {
    try {
      const [result] = await db.query(
        'INSERT INTO courses (title, description, created_by) VALUES (?, ?, ?)',
        [courseData.title, courseData.description, courseData.created_by]
      );
      return this.findById(result.insertId);
    } catch (error) {
      logger.error('Error in Course.create:', error);
      throw error;
    }
  }

  static async update(id, courseData) {
    try {
      await db.query(
        'UPDATE courses SET title = ?, description = ? WHERE course_id = ?',
        [courseData.title, courseData.description, id]
      );
      return this.findById(id);
    } catch (error) {
      logger.error('Error in Course.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM courses WHERE course_id = ?', [id]);
    } catch (error) {
      logger.error('Error in Course.delete:', error);
      throw error;
    }
  }

  static async findEnrollment(userId, courseId) {
    const enrollments = await db.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    return enrollments[0] || null;
  }

  static async enroll(courseId, userId) {
    try {
      await db.query(
        'INSERT INTO course_enrollments (course_id, user_id) VALUES (?, ?)',
        [courseId, userId]
      );
    } catch (error) {
      logger.error('Error in Course.enroll:', error);
      throw error;
    }
  }
}

module.exports = Course; 