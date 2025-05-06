const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['announcement', 'material', 'question'],
    default: 'announcement',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  attachments: [{
    url: String,
    filename: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Post', PostSchema);
