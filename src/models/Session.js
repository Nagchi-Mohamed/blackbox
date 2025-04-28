const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  token: { 
    type: String, 
    required: true 
  },
  ipAddress: String,
  userAgent: String,
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '30d' // Auto-delete after 30 days
  }
});

// Index for faster queries
sessionSchema.index({ userId: 1, token: 1 });

module.exports = mongoose.model('Session', sessionSchema); 