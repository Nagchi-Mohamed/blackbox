const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const moduleController = require('../controllers/moduleController');

// Create module (admin/teacher)
router.post(
  '/',
  auth,
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
  auth,
  moduleController.updateModule
);

// Delete module (admin/creator)
router.delete(
  '/:id',
  auth,
  moduleController.deleteModule
);

// Reorder modules (admin/creator)
router.post(
  '/course/:course_id/reorder',
  auth,
  moduleController.reorderModules
);

module.exports = router; 