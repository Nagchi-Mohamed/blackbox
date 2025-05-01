const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');
const { verifyToken } = require('../middleware/auth');

// Create a new forum post
router.post('/', verifyToken, async (req, res) => {
  try {
    const forum = new Forum({
      ...req.body,
      author: req.userId
    });
    await forum.save();
    res.status(201).json(forum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all forum posts
router.get('/', async (req, res) => {
  try {
    const forums = await Forum.find().populate('author', 'username');
    res.json(forums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ... existing code ...