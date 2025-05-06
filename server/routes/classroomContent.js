const express = require('express');
const router = express.Router({ mergeParams: true });
const classroomContentController = require('../controllers/classroomContentController');
const authMiddleware = require('../middlewares/auth');

// Posts routes
router.get('/:classroomId/posts', authMiddleware.verifyToken, classroomContentController.getPostsByClassroom);
router.post('/:classroomId/posts', authMiddleware.verifyToken, classroomContentController.createPost);
router.put('/:classroomId/posts/:postId', authMiddleware.verifyToken, classroomContentController.updatePost);
router.delete('/:classroomId/posts/:postId', authMiddleware.verifyToken, classroomContentController.deletePost);

// Comments routes for posts
router.get('/:classroomId/posts/:postId/comments', authMiddleware.verifyToken, classroomContentController.getComments);
router.post('/:classroomId/posts/:postId/comments', authMiddleware.verifyToken, classroomContentController.createComment);

// Assignments routes
router.get('/:classroomId/assignments', authMiddleware.verifyToken, classroomContentController.getAssignmentsByClassroom);
router.post('/:classroomId/assignments', authMiddleware.verifyToken, classroomContentController.createAssignment);
router.put('/:classroomId/assignments/:assignmentId', authMiddleware.verifyToken, classroomContentController.updateAssignment);
router.delete('/:classroomId/assignments/:assignmentId', authMiddleware.verifyToken, classroomContentController.deleteAssignment);

// Comments routes for assignments
router.get('/:classroomId/assignments/:assignmentId/comments', authMiddleware.verifyToken, classroomContentController.getComments);
router.post('/:classroomId/assignments/:assignmentId/comments', authMiddleware.verifyToken, classroomContentController.createComment);

// Submissions routes for assignments
router.get('/:classroomId/assignments/:assignmentId/submissions', authMiddleware.verifyToken, classroomContentController.getSubmissionsByAssignment);
router.post('/:classroomId/assignments/:assignmentId/submissions', authMiddleware.verifyToken, classroomContentController.createSubmission);
router.put('/:classroomId/assignments/:assignmentId/submissions/:submissionId', authMiddleware.verifyToken, classroomContentController.updateSubmission);

module.exports = router;
