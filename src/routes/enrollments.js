const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { auth, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment management
 */

/**
 * @swagger
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID
 *     responses:
 *       201:
 *         description: Successfully enrolled in course
 *       400:
 *         description: Already enrolled in course
 *       401:
 *         description: Unauthorized
 */
router.post('/courses/:course_id/enroll', 
  auth, 
  enrollmentController.enrollInCourse
);

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get user's enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's enrollments
 *       401:
 *         description: Unauthorized
 */
router.get('/enrollments', 
  auth, 
  enrollmentController.getUserEnrollments
);

/**
 * @swagger
 * /enrollments/{enrollmentId}:
 *   patch:
 *     summary: Update enrollment status
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, completed, dropped]
 *               progress_percentage:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enrollment not found
 */
router.patch('/enrollments/:enrollment_id', 
  auth, 
  enrollmentController.updateEnrollmentStatus
);

/**
 * @swagger
 * /courses/{courseId}/enrollments:
 *   get:
 *     summary: Get course enrollments (for course creator)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: List of course enrollments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to view enrollments
 */
router.get('/courses/:course_id/enrollments', 
  auth, 
  enrollmentController.getCourseEnrollments
);

module.exports = router; 