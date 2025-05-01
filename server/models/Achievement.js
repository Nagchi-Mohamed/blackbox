const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    en: String,
    fr: String,
    es: String
  },
  description: {
    en: String,
    fr: String,
    es: String
  },
  icon: String,
  criteria: {
    type: Map,
    of: Number
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);