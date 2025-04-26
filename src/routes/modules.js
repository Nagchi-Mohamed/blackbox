const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const moduleController = require('../controllers/moduleController');

// Create module (admin/teacher)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'teacher']),
  moduleController.createModule
);

// Get all modules for a course
router.get('/course/:course_id', moduleController.getModules);

// Get single module
router.get('/:id', moduleController.getModule);

// Update module (admin/creator)
router.put(
  '/:id',
  authenticate,
  moduleController.updateModule
);

// Delete module (admin/creator)
router.delete(
  '/:id',
  authenticate,
  moduleController.deleteModule
);

// Reorder modules (admin/creator)
router.post(
  '/course/:course_id/reorder',
  authenticate,
  moduleController.reorderModules
);

module.exports = router; 