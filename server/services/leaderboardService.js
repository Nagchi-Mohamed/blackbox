const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

const updateLeaderboard = async (userId) => {
  const user = await User.findById(userId).populate('achievements');
  await Leaderboard.findOneAndUpdate(
    { user: userId },
    {
      score: calculateScore(user),
      achievementsCount: user.achievements.length,
      lastUpdated: new Date()
    },
    { upsert: true }
  );
};

const getTopUsers = async (limit = 10) => {
  return Leaderboard.find()
    .sort({ score: -1 })
    .limit(limit)
    .populate('user', 'username');
};

function calculateScore(user) {
  let score = 0;
  // Add scoring logic based on achievements, progress, etc.
  return score;
}

module.exports = {
  updateLeaderboard,
  getTopUsers
};