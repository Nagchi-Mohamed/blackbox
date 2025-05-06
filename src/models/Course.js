const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ['primary', 'middle', 'high', 'university'], required: true },
  curriculum: { type: String, enum: ['moroccan', 'international'], required: true },
  thumbnailUrl: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  duration: Number, // in hours
  isActive: { type: Boolean, default: true },
  languages: [{ type: String, enum: ['en', 'fr'] }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);