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
  // Removed duplicate pdfUrl field here
  level: {
    type: String,
    enum: ['primary', 'middle', 'high', 'college'],
    required: true
  },
  exercises: [{
    question: {
      type: new mongoose.Schema({
        en: { type: String, required: true },
        fr: { type: String, required: true },
        es: { type: String, required: true }
      }, { _id: false }),
      required: true
    },
    options: {
      en: { type: [String], required: true },
      fr: { type: [String], required: true },
      es: { type: [String], required: true }
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
  pdfUrl: String,
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
