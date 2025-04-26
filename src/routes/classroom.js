const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { classroomSchema } = require('../validations/classroomValidation');

// Create new classroom
router.post(
  '/',
  authenticate,
  validate(classroomSchema),
  classroomController.createClassroom
);

// Join classroom
router.post(
  '/:id/join',
  authenticate,
  classroomController.joinClassroom
);

// Start classroom session
router.post(
  '/:id/start',
  authenticate,
  classroomController.startClassroom
);

// End classroom session
router.post(
  '/:id/end',
  authenticate,
  classroomController.endClassroom
);

// Get classroom details
router.get(
  '/:id',
  authenticate,
  classroomController.getClassroomDetails
);

module.exports = router; 