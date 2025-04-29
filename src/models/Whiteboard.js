const mongoose = require('mongoose');

const whiteboardSessionSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  state: { type: Object, required: true }, // Fabric.js JSON
  history: { type: [Object], default: [] }, // For undo/redo
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

whiteboardSessionSchema.index({ classroomId: 1 }); // Index for efficient querying

const WhiteboardSession = mongoose.model('WhiteboardSession', whiteboardSessionSchema);

module.exports = WhiteboardSession;