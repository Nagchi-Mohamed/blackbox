const mongoose = require('mongoose');

const interventionSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    classId: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['tutoring', 'peer_learning', 'resource_change', 'parent_meeting']
    },
    status: { 
        type: String, 
        default: 'pending',
        enum: ['pending', 'in_progress', 'completed', 'cancelled'] 
    },
    priority: {
        type: String,
        default: 'medium',
        enum: ['high', 'medium', 'low']
    },
    notes: String,
    createdBy: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    effectiveness: { type: Number, min: 0, max: 5 },
    followUps: [{
        date: Date,
        notes: String,
        changedBy: String
    }]
}, { timestamps: true });

// Pre-save middleware to validate endDate
interventionSchema.pre('save', function(next) {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
        next(new Error('End date must be after start date'));
    }
    next();
});

// Create indexes for common queries
interventionSchema.index({ studentId: 1, createdAt: -1 });
interventionSchema.index({ classId: 1, priority: -1, createdAt: -1 });
interventionSchema.index({ status: 1 });

const Intervention = mongoose.model('Intervention', interventionSchema);

module.exports = Intervention; 