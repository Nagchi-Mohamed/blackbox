const express = require('express');
const router = express.Router();
const { searchAll } = require('../services/searchService');

router.get('/', async (req, res) => {
  try {
    const { q, lang } = req.query;
    const results = await searchAll(q, lang || 'en');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;