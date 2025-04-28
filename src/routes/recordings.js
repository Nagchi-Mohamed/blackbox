const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const recordingController = require('../controllers/recordingController');

// Get all recordings
router.get('/', auth, recordingController.getRecordings);

// Get a single recording
router.get('/:id', auth, recordingController.getRecording);

// Create a new recording
router.post('/', auth, authorize(['teacher', 'admin']), recordingController.createRecording);

// Update a recording
router.put('/:id', auth, authorize(['teacher', 'admin']), recordingController.updateRecording);

// Delete a recording
router.delete('/:id', auth, authorize(['admin']), recordingController.deleteRecording);

module.exports = router; 