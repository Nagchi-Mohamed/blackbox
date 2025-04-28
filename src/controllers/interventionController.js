const Intervention = require('../models/Intervention');
const Student = require('../models/Student');
const Class = require('../models/Class');
const logger = require('../utils/logger');

// Get all interventions for a student
exports.getStudentInterventions = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const interventions = await Intervention.find({ studentId })
            .sort({ createdAt: -1 });

        res.json(interventions);
    } catch (error) {
        logger.error('Error retrieving interventions:', error);
        res.status(500).json({ message: 'Error retrieving interventions', error: error.message });
    }
};

// Get all interventions for a class
exports.getClassInterventions = async (req, res) => {
    try {
        const { classId } = req.params;
        
        // Verify class exists
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const interventions = await Intervention.find({ classId })
            .sort({ createdAt: -1 });

        res.json(interventions);
    } catch (error) {
        logger.error('Error retrieving class interventions:', error);
        res.status(500).json({ message: 'Error retrieving class interventions', error: error.message });
    }
};

// Create a new intervention
exports.createIntervention = async (req, res) => {
    try {
        const { studentId, classId, type, notes, priority } = req.body;

        // Verify student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Verify class exists
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const intervention = new Intervention({
            studentId,
            classId,
            type,
            notes,
            priority,
            createdBy: req.user._id,
            status: 'pending'
        });

        await intervention.save();
        
        res.status(201).json(intervention);
    } catch (error) {
        logger.error('Error creating intervention:', error);
        res.status(500).json({ message: 'Error creating intervention', error: error.message });
    }
};

// Update an intervention
exports.updateIntervention = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const intervention = await Intervention.findById(id);
        if (!intervention) {
            return res.status(404).json({ message: 'Intervention not found' });
        }

        // Verify the teacher owns this intervention
        if (intervention.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this intervention' });
        }

        const updatedIntervention = await Intervention.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.json(updatedIntervention);
    } catch (error) {
        logger.error('Error updating intervention:', error);
        res.status(500).json({ message: 'Error updating intervention', error: error.message });
    }
};

// Record intervention effectiveness
exports.recordEffectiveness = async (req, res) => {
    try {
        const { id } = req.params;
        const { effectiveness, notes } = req.body;

        const intervention = await Intervention.findById(id);
        if (!intervention) {
            return res.status(404).json({ message: 'Intervention not found' });
        }

        // Verify the teacher owns this intervention
        if (intervention.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this intervention' });
        }

        intervention.effectiveness = effectiveness;
        intervention.notes = notes;
        intervention.status = 'completed';

        await intervention.save();

        res.json(intervention);
    } catch (error) {
        logger.error('Error recording effectiveness:', error);
        res.status(500).json({ message: 'Error recording effectiveness', error: error.message });
    }
}; 