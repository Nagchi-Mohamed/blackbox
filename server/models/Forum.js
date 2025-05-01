const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  title: {
    en: String,
    fr: String,
    es: String
  },
  content: {
    en: String,
    fr: String,
    es: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  comments: [{
    content: {
      en: String,
      fr: String,
      es: String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Forum', forumSchema);