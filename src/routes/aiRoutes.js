const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/authMiddleware');
const mathService = require('../services/MathAssistanceService');
const engagementService = require('../services/EngagementService');
const logger = require('../utils/logger');

// Math problem solving
router.post('/solve', authenticate, async (req, res) => {
  try {
    const solution = await mathService.solveProblem(req.body.problem);
    res.json(solution);
  } catch (error) {
    logger.error('Math solving error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Work verification
router.post('/verify', authenticate, async (req, res) => {
  try {
    const verification = await mathService.checkWork(
      req.body.problem, 
      req.body.solution
    );
    res.json({ result: verification });
  } catch (error) {
    logger.error('Work verification error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Engagement data
router.get('/engagement/:roomId', authenticate, isTeacher, (req, res) => {
  try {
    res.json({
      data: engagementService.getEngagementData(req.params.roomId),
      disengaged: engagementService.predictDisengagement(req.params.roomId)
    });
  } catch (error) {
    logger.error('Engagement data error:', error);
    res.status(500).json({ error: 'Failed to get engagement data' });
  }
});

module.exports = router; 