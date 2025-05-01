const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// Get lessons (filter by language)
router.get('/', async (req, res) => {
  const lang = req.query.lang || 'en';
  const lessons = await Lesson.find({}, `title.${lang} content.${lang} exercises.${lang} pdfUrl`);
  res.json(lessons);
});

// Admin CRUD operations (add JWT auth middleware later)
router.post('/', async (req, res) => {
  const newLesson = new Lesson(req.body);
  await newLesson.save();
  res.status(201).send(newLesson);
});

module.exports = router;
