const pool = require('../utils/db');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const enrollmentController = {
  enrollInCourse: async (req, res, next) => {
    try {
      const { course_id } = req.params;
      const user_id = req.user.id;

      // Check if already enrolled
      const [existing] = await pool.query(
        'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
        [user_id, course_id]
      );

      if (existing.length > 0) {
        throw new AppError('Already enrolled in this course', 400);
      }

      // Create enrollment
      const [result] = await pool.query(
        `INSERT INTO enrollments (user_id, course_id)
         VALUES (?, ?)`,
        [user_id, course_id]
      );

      const [enrollment] = await pool.query(
        `SELECT e.*, c.title as course_title, u.username
         FROM enrollments e
         JOIN courses c ON e.course_id = c.course_id
         JOIN users u ON e.user_id = u.user_id
         WHERE e.enrollment_id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        status: 'success',
        data: enrollment[0]
      });
    } catch (error) {
      logger.error('Enrollment failed:', error);
      next(error);
    }
  },

  getUserEnrollments: async (req, res, next) => {
    try {
      const user_id = req.user.id;

      const [enrollments] = await pool.query(
        `SELECT e.*, c.title as course_title, c.description as course_description,
                u.username as instructor_name
         FROM enrollments e
         JOIN courses c ON e.course_id = c.course_id
         JOIN users u ON c.created_by = u.user_id
         WHERE e.user_id = ?
         ORDER BY e.enrolled_at DESC`,
        [user_id]
      );

      res.status(200).json({
        status: 'success',
        data: enrollments
      });
    } catch (error) {
      logger.error('Failed to fetch enrollments:', error);
      next(error);
    }
  },

  updateEnrollmentStatus: async (req, res, next) => {
    try {
      const { enrollment_id } = req.params;
      const { status, progress_percentage } = req.body;
      const user_id = req.user.id;

      // Verify enrollment exists and belongs to user
      const [enrollment] = await pool.query(
        'SELECT * FROM enrollments WHERE enrollment_id = ? AND user_id = ?',
        [enrollment_id, user_id]
      );

      if (!enrollment.length) {
        throw new AppError('Enrollment not found', 404);
      }

      // Update enrollment
      await pool.query(
        `UPDATE enrollments 
         SET status = ?, progress_percentage = ?, last_accessed_at = CURRENT_TIMESTAMP
         WHERE enrollment_id = ?`,
        [status, progress_percentage, enrollment_id]
      );

      const [updated] = await pool.query(
        `SELECT e.*, c.title as course_title
         FROM enrollments e
         JOIN courses c ON e.course_id = c.course_id
         WHERE e.enrollment_id = ?`,
        [enrollment_id]
      );

      res.status(200).json({
        status: 'success',
        data: updated[0]
      });
    } catch (error) {
      logger.error('Failed to update enrollment:', error);
      next(error);
    }
  },

  getCourseEnrollments: async (req, res, next) => {
    try {
      const { course_id } = req.params;
      const user_id = req.user.id;

      // Verify user is course creator
      const [course] = await pool.query(
        'SELECT created_by FROM courses WHERE course_id = ?',
        [course_id]
      );

      if (!course.length || course[0].created_by !== user_id) {
        throw new AppError('Unauthorized to view course enrollments', 403);
      }

      const [enrollments] = await pool.query(
        `SELECT e.*, u.username, u.email
         FROM enrollments e
         JOIN users u ON e.user_id = u.user_id
         WHERE e.course_id = ?
         ORDER BY e.enrolled_at DESC`,
        [course_id]
      );

      res.status(200).json({
        status: 'success',
        data: enrollments
      });
    } catch (error) {
      logger.error('Failed to fetch course enrollments:', error);
      next(error);
    }
  }
};

module.exports = enrollmentController; 