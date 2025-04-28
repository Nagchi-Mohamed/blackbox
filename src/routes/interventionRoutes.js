const express = require('express');
const router = express.Router();
const { auth, isTeacher } = require('../middleware/auth');
const interventionController = require('../controllers/interventionController');

// Get all interventions for a student
router.get('/student/:studentId', auth, interventionController.getStudentInterventions);

// Get all interventions for a class
router.get('/class/:classId', auth, isTeacher, interventionController.getClassInterventions);

// Create a new intervention
router.post('/', auth, isTeacher, interventionController.createIntervention);

// Update an intervention
router.put('/:id', auth, isTeacher, interventionController.updateIntervention);

// Record intervention effectiveness
router.post('/:id/effectiveness', auth, isTeacher, interventionController.recordEffectiveness);

module.exports = router; 