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

const InterventionModel = mongoose.model('Intervention', interventionSchema);

class InterventionService {
  constructor() {
    this.Intervention = InterventionModel;
  }

  async createIntervention(data) {
    const intervention = new this.Intervention(data);
    return await intervention.save();
  }

  async updateIntervention(id, updates) {
    return await this.Intervention.findByIdAndUpdate(id, updates, { new: true });
  }

  async getStudentInterventions(studentId) {
    return await this.Intervention.find({ studentId })
      .sort({ createdAt: -1 });
  }

  async getClassInterventions(classId) {
    return await this.Intervention.find({ classId })
      .sort({ priority: -1, createdAt: -1 });
  }

  async recordEffectiveness(id, effectiveness, notes) {
    return await this.Intervention.findByIdAndUpdate(id, {
      effectiveness,
      status: 'completed',
      endDate: new Date(),
      $push: {
        followUps: {
          date: new Date(),
          notes,
          changedBy: 'system'
        }
      }
    }, { new: true });
  }

  async analyzeInterventionEffectiveness(studentId) {
    const interventions = await this.getStudentInterventions(studentId);
    const completed = interventions.filter(i => i.status === 'completed');
    
    if (completed.length === 0) return null;

    const avgEffectiveness = completed.reduce(
      (sum, i) => sum + (i.effectiveness || 0), 0
    ) / completed.length;

    const mostEffective = completed.reduce((best, current) => 
      (current.effectiveness || 0) > (best.effectiveness || 0) ? current : best
    );

    return {
      avgEffectiveness,
      mostEffectiveType: mostEffective.type,
      totalInterventions: completed.length
    };
  }
}

module.exports = new InterventionService(); 