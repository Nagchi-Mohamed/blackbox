const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { classroomSchema } = require('../validations/classroomValidation');

// Create new classroom
router.post(
  '/',
  auth,
  validate(classroomSchema),
  classroomController.createClassroom
);

// Join classroom
router.post(
  '/:id/join',
  auth,
  classroomController.joinClassroom
);

// Start classroom session
router.post(
  '/:id/start',
  auth,
  classroomController.startClassroom
);

// End classroom session
router.post(
  '/:id/end',
  auth,
  classroomController.endClassroom
);

// Get classroom details
router.get(
  '/:id',
  auth,
  classroomController.getClassroomDetails
);

module.exports = router; 