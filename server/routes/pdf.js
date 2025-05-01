const express = require('express');
const router = express.Router();
const { downloadPDF } = require('../services/pdfService');
const { verifyToken } = require('../middleware/auth');

router.get('/:lessonId', verifyToken, async (req, res) => {
  try {
    const { filePath, fileName, contentType } = await downloadPDF(req.params.lessonId, req.userId);
    res.download(filePath, fileName, {
      headers: {
        'Content-Type': contentType
      }
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;