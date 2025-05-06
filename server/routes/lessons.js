const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { getFeaturedLessons } = require('../controllers/lessonController');

// Get lessons (filter by language)
router.get('/', async (req, res) => {
  const lang = req.query.lang || 'en';
  const lessons = await Lesson.find({}, `title.${lang} content.${lang} exercises.${lang} pdfUrl`);
  res.json(lessons);
});

// New route for featured lessons
router.get('/featured', getFeaturedLessons);

// Admin CRUD operations with auth middleware
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const newLesson = new Lesson(req.body);
    await newLesson.save();
    res.status(201).send(newLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!deletedLesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
