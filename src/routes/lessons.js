const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const lessonController = require('../controllers/lessonController');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { createLesson: createSchema, updateLesson: updateSchema, reorderLessons: reorderSchema, listLessons } = require('../validations/lessonValidation');

// Create new lesson
router.post(
  '/',
  authenticate,
  authorize(['admin', 'teacher']),
  validate(createSchema),
  upload.lessonContent.single('content_file'),
  lessonController.createLesson
);

// Get lessons by module
router.get(
  '/module/:module_id',
  validate(listLessons, 'query'),
  lessonController.getLessons
);

// Get single lesson
router.get(
  '/:id',
  lessonController.getLesson
);

// Update lesson
router.put(
  '/:id',
  authenticate,
  validate(updateSchema),
  upload.lessonContent.single('content_file'),
  lessonController.updateLesson
);

// Delete lesson
router.delete(
  '/:id',
  authenticate,
  lessonController.deleteLesson
);

// Reorder lessons
router.post(
  '/module/:module_id/reorder',
  authenticate,
  validate(reorderSchema),
  lessonController.reorderLessons
);

module.exports = router; 