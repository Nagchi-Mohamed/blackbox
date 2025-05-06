const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
  progress: {
    completedExercises: [{
      exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson.exercises'
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      attempts: {
        type: Number,
        default: 1
      },
      score: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    lastActive: {
      type: Date,
      default: Date.now
    },
    streak: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number, // in minutes
      default: 0
    }
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      enum: ['en', 'fr', 'es'],
      default: 'en'
    }
  },
  achievements: [{
    achievementId: {
      type: String,
      required: true
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }]
});

module.exports = mongoose.model('User', userSchema);
