const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  deviceType: { 
    type: String, 
    enum: ['desktop', 'mobile', 'tablet'], 
    required: true 
  },
  userAgent: String,
  ipAddress: { 
    type: String, 
    required: true 
  },
  location: String,
  success: { 
    type: Boolean, 
    required: true 
  }
});

// Index for faster queries
loginHistorySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('LoginHistory', loginHistorySchema); 