const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const recordingController = require('../controllers/recordingController');

// Get all recordings
router.get('/', authenticate, recordingController.getRecordings);

// Get a single recording
router.get('/:id', authenticate, recordingController.getRecording);

// Create a new recording
router.post('/', authenticate, authorize(['teacher', 'admin']), recordingController.createRecording);

// Update a recording
router.put('/:id', authenticate, authorize(['teacher', 'admin']), recordingController.updateRecording);

// Delete a recording
router.delete('/:id', authenticate, authorize(['admin']), recordingController.deleteRecording);

module.exports = router; 