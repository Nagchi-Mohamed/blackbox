const express = require('express');
const router = express.Router();
const { auth, isTeacher } = require('../middleware/auth');
const reportService = require('../services/ReportService');
const logger = require('../utils/logger');

// Generate progress report
router.post('/:studentId/generate', auth, isTeacher, async (req, res) => {
  try {
    const report = await reportService.generateProgressReport(
      req.params.studentId,
      req.body.format || 'pdf'
    );
    
    if (req.body.format === 'html') {
      res.send(report);
    } else {
      res.set('Content-Type', 'application/pdf');
      res.send(report);
    }
  } catch (error) {
    logger.error('Failed to generate report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send report to parent
router.post('/:studentId/send', auth, isTeacher, async (req, res) => {
  try {
    await reportService.sendReportToParent(
      req.params.studentId,
      req.body.email
    );
    res.json({ message: 'Report sending endpoint' });
  } catch (error) {
    logger.error('Failed to send report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get report history
router.get('/:studentId/history', auth, async (req, res) => {
  try {
    const history = await reportService.getReportHistory(req.params.studentId);
    res.json(history);
  } catch (error) {
    logger.error('Failed to get report history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 