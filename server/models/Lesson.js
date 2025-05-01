const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
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
  pdfUrl: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['primary', 'middle', 'high', 'college'],
    required: true
  },
  exercises: [{
    question: {
      en: String,
      fr: String,
      es: String,
      required: [true, 'Question is required']
    },
    options: {
      en: [String],
      fr: [String],
      es: [String],
      required: [true, 'Options are required']
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required']
    },
    explanation: {
      en: String,
      fr: String,
      es: String
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  pdfUrl: String, // Path to uploaded PDF
  createdAt: { type: Date, default: Date.now },
  pdfDownloads: {
    type: Number,
    default: 0
  },
  pdfSize: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
