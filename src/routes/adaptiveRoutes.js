const express = require('express');
const router = express.Router();
const { authenticate, isTeacher } = require('../middleware/auth');
const knowledgeService = require('../services/KnowledgeGraphService');
const engagementService = require('../services/EngagementService');
const logger = require('../utils/logger');

// Get adaptive recommendations
router.get('/recommendations/:studentId', authenticate, async (req, res) => {
  try {
    const graph = await knowledgeService.getStudentGraph(req.params.studentId);
    const recommendations = await knowledgeService.getRecommendedConcepts(req.params.studentId);
    res.json({ graph, recommendations });
  } catch (error) {
    logger.error('Failed to get recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Update concept mastery
router.post('/mastery', authenticate, async (req, res) => {
  try {
    await knowledgeService.updateMastery(
      req.body.studentId,
      req.body.concept,
      req.body.isCorrect
    );
    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to update mastery:', error);
    res.status(500).json({ error: 'Failed to update mastery' });
  }
});

// Get engagement predictions
router.get('/engagement/:roomId', authenticate, isTeacher, async (req, res) => {
  try {
    const students = await engagementService.getCurrentStudents(req.params.roomId);
    const predictions = await Promise.all(
      students.map(async student => {
        const prediction = await engagementService.predictDisengagement(student);
        return { ...student, ...prediction };
      })
    );

    res.json({
      students: predictions,
      alerts: predictions.filter(s => s.willDisengage)
    });
  } catch (error) {
    logger.error('Failed to get engagement predictions:', error);
    res.status(500).json({ error: 'Failed to get engagement predictions' });
  }
});

module.exports = router; 