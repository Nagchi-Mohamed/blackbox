const Recording = require('../models/Recording');
const { NotFoundError, ValidationError } = require('../utils/errors');

// Get all recordings
exports.getRecordings = async (req, res, next) => {
  try {
    const recordings = await Recording.findAll();
    res.json(recordings);
  } catch (err) {
    next(err);
  }
};

// Get a single recording
exports.getRecording = async (req, res, next) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) {
      throw new NotFoundError('Recording not found');
    }
    res.json(recording);
  } catch (err) {
    next(err);
  }
};

// Create a new recording
exports.createRecording = async (req, res, next) => {
  try {
    const { title, description, classroom_id } = req.body;
    if (!title || !classroom_id) {
      throw new ValidationError('Title and classroom_id are required');
    }
    const recording = await Recording.create({
      title,
      description,
      classroom_id,
      created_by: req.user.user_id
    });
    res.status(201).json(recording);
  } catch (err) {
    next(err);
  }
};

// Update a recording
exports.updateRecording = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const recording = await Recording.findById(req.params.id);
    if (!recording) {
      throw new NotFoundError('Recording not found');
    }
    if (recording.created_by !== req.user.user_id && req.user.role !== 'admin') {
      throw new ValidationError('You can only update your own recordings');
    }
    const updatedRecording = await Recording.update(req.params.id, {
      title,
      description
    });
    res.json(updatedRecording);
  } catch (err) {
    next(err);
  }
};

// Delete a recording
exports.deleteRecording = async (req, res, next) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) {
      throw new NotFoundError('Recording not found');
    }
    await Recording.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}; 