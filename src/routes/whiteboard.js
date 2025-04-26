const express = require('express');
const router = express.Router();
const whiteboardController = require('../controllers/whiteboardController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { whiteboardSchema, searchSchema } = require('../validations/whiteboardValidation');

// Get current whiteboard state
router.get(
  '/:classroom_id/state',
  authenticate,
  whiteboardController.getWhiteboardState
);

// Save whiteboard state
router.post(
  '/:classroom_id/state',
  authenticate,
  validate(whiteboardSchema),
  whiteboardController.saveWhiteboardState
);

// Get whiteboard history
router.get(
  '/:classroom_id/history',
  authenticate,
  whiteboardController.getWhiteboardHistory
);

// Search whiteboard states
router.get(
  '/:classroom_id/search',
  authenticate,
  validate(searchSchema),
  whiteboardController.searchWhiteboardStates
);

module.exports = router; 