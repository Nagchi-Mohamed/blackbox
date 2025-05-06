const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const bcrypt = require('bcrypt');

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

// Update exercise in lesson
router.put('/lessons/:lessonId/exercises/:exerciseId', verifyToken, isAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const exercise = lesson.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    Object.assign(exercise, req.body);
    await lesson.save();
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete exercise from lesson
router.delete('/lessons/:lessonId/exercises/:exerciseId', verifyToken, isAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const exercise = lesson.exercises.id(req.params.exerciseId);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    exercise.remove();
    await lesson.save();
    res.json({ message: 'Exercise deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add new user
router.post('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash, role });
    await newUser.save();
    res.status(201).json({ id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ id: user._id, username: user.username, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;
