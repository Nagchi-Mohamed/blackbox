const Achievement = require('../models/Achievement');
const User = require('../models/User');

const checkAchievements = async (userId, action, count) => {
  try {
    const achievements = await Achievement.find({
      [`criteria.${action}`]: { $exists: true }
    });
    
    const user = await User.findById(userId);
    
    for (const achievement of achievements) {
      if (!user.achievements.some(a => a.achievementId === achievement.id)) {
        const required = achievement.criteria.get(action);
        if (count >= required) {
          user.achievements.push({
            achievementId: achievement.id,
            progress: 100
          });
        } else {
          user.achievements.push({
            achievementId: achievement.id,
            progress: Math.floor((count / required) * 100)
          });
        }
      }
    }
    
    await user.save();
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

module.exports = {
  checkAchievements
};