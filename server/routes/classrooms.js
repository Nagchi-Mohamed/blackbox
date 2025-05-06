const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { verifyToken } = require('../middlewares/auth');

// Get all classrooms
router.get('/', verifyToken, classroomController.getAllClassrooms);

// Get classroom by ID
router.get('/:id', verifyToken, classroomController.getClassroomById);

// Create a new classroom
router.post('/', verifyToken, classroomController.createClassroom);

// Join a classroom
router.post('/:id/join', verifyToken, classroomController.joinClassroom);

// Leave a classroom
router.post('/:id/leave', verifyToken, classroomController.leaveClassroom);

module.exports = router;
