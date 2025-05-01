const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const activeUsersCount = await User.countDocuments({
      'progress.lastActive': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const lessonsCount = await Lesson.countDocuments();
    const exercisesCount = await Lesson.aggregate([
      { $project: { exerciseCount: { $size: '$exercises' } } },
      { $group: { _id: null, total: { $sum: '$exerciseCount' } } }
    ]);

    res.json({
      users: usersCount,
      activeUsers: activeUsersCount,
      lessons: lessonsCount,
      exercises: exercisesCount[0]?.total || 0,
      activityData: await getActivityData()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getActivityData() {
  // Returns last 7 days of user activity
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const count = await User.countDocuments({
      'progress.lastActive': {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    data.push({
      date: date.toLocaleDateString(),
      users: count
    });
  }
  return data;
}

// Add exercise to lesson
router.post('/lessons/:id/exercises', verifyToken, isAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.exercises.push(req.body);
    await lesson.save();
    res.status(201).json(lesson.exercises[lesson.exercises.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;