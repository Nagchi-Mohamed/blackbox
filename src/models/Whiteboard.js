const mongoose = require('mongoose');

const whiteboardSessionSchema = new mongoose.Schema({
  state: { type: Object, required: true }, // Fabric.js JSON
  history: { type: [Object], default: [] }, // For undo/redo
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WhiteboardSession = mongoose.model('WhiteboardSession', whiteboardSessionSchema);

module.exports = WhiteboardSession;
