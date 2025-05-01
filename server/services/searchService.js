const Lesson = require('../models/Lesson');
const Forum = require('../models/Forum');

const searchAll = async (query, language = 'en') => {
  try {
    const lessons = await Lesson.find({
      $or: [
        { [`title.${language}`]: { $regex: query, $options: 'i' } },
        { [`content.${language}`]: { $regex: query, $options: 'i' } }
      ]
    });

    const forumPosts = await Forum.find({
      $or: [
        { [`title.${language}`]: { $regex: query, $options: 'i' } },
        { [`content.${language}`]: { $regex: query, $options: 'i' } }
      ]
    }).populate('author', 'username');

    return {
      lessons,
      forumPosts
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  searchAll
};