const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/auth');
const progressService = require('../services/ProgressService');
const logger = require('../utils/logger');

// Record progress update
router.post('/', authenticate, async (req, res) => {
  try {
    const record = await progressService.recordProgress(req.body);
    res.json(record);
  } catch (error) {
    logger.error('Failed to record progress:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get progress data
router.get('/:studentId', authenticate, async (req, res) => {
  try {
    const data = await progressService.getProgressTrends(req.params.studentId);
    res.json(data);
  } catch (error) {
    logger.error('Failed to get progress data:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get intervention recommendations (teacher only)
router.get('/:studentId/recommendations', authenticate, isTeacher, async (req, res) => {
  try {
    const recommendations = await progressService.getInterventionRecommendations(req.params.studentId);
    res.json(recommendations);
  } catch (error) {
    logger.error('Failed to get recommendations:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get class-wide progress (teacher only)
router.get('/class/:classId', authenticate, isTeacher, async (req, res) => {
  try {
    const data = await progressService.getClassProgress(req.params.classId);
    res.json(data);
  } catch (error) {
    logger.error('Failed to get class progress:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 