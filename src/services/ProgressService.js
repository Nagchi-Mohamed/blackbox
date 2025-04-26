const pool = require('../utils/db');
const logger = require('../utils/logger');

class ProgressService {
  async recordProgress(data) {
    const { studentId, concept, mastery, attempts, successes, timeSpent, assessmentType } = data;
    
    try {
      const [result] = await pool.query(
        `INSERT INTO progress_records (
          student_id, concept, mastery, attempts, successes, 
          time_spent, assessment_type, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [studentId, concept, mastery, attempts, successes, timeSpent, assessmentType]
      );
      
      return { id: result.insertId, ...data };
    } catch (error) {
      logger.error('Error recording progress:', error);
      throw new Error('Failed to record progress');
    }
  }

  async getProgressTrends(studentId, options = {}) {
    const { timeframe = 'month', groupBy = 'week' } = options;
    
    try {
      // Get weekly progress
      const [weekly] = await pool.query(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%u') as week,
          AVG(mastery) as avg_mastery,
          SUM(time_spent) as total_time,
          COUNT(*) as record_count
         FROM progress_records
         WHERE student_id = ?
         AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
         GROUP BY week
         ORDER BY week ASC`,
        [studentId]
      );

      // Get monthly progress
      const [monthly] = await pool.query(
        `SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          AVG(mastery) as avg_mastery,
          SUM(time_spent) as total_time,
          COUNT(*) as record_count
         FROM progress_records
         WHERE student_id = ?
         AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
         GROUP BY month
         ORDER BY month ASC`,
        [studentId]
      );

      // Get concept-specific progress
      const [byConcept] = await pool.query(
        `SELECT 
          concept,
          AVG(mastery) as current_mastery,
          MAX(mastery) as peak_mastery,
          MAX(mastery) - MIN(mastery) as improvement,
          SUM(time_spent) as time_invested
         FROM progress_records
         WHERE student_id = ?
         GROUP BY concept`,
        [studentId]
      );

      return { weekly, monthly, byConcept };
    } catch (error) {
      logger.error('Error getting progress trends:', error);
      throw new Error('Failed to get progress trends');
    }
  }

  async getInterventionRecommendations(studentId) {
    try {
      // Get recent progress
      const [recentProgress] = await pool.query(
        `SELECT 
          concept,
          mastery,
          created_at
         FROM progress_records
         WHERE student_id = ?
         ORDER BY created_at DESC
         LIMIT 50`,
        [studentId]
      );

      const recommendations = [];
      
      // Check for declining trends
      if (recentProgress.length >= 3) {
        const recent = recentProgress.slice(0, 3);
        const trend = this.calculateTrend(recent.map(r => r.mastery));
        if (trend < -0.1) {
          recommendations.push({
            type: 'declining_performance',
            severity: 'high',
            message: 'Overall performance declining over last 3 weeks',
            suggestedActions: [
              'Review foundational concepts',
              'Schedule 1:1 tutoring session',
              'Adjust difficulty level'
            ]
          });
        }
      }

      // Check for struggling concepts
      const [conceptProgress] = await pool.query(
        `SELECT 
          concept,
          AVG(mastery) as avg_mastery,
          SUM(time_spent) as total_time
         FROM progress_records
         WHERE student_id = ?
         GROUP BY concept
         HAVING avg_mastery < 0.5 AND total_time > 30`,
        [studentId]
      );

      conceptProgress.forEach(concept => {
        recommendations.push({
          type: 'struggling_concept',
          concept: concept.concept,
          severity: 'medium',
          message: `Struggling with ${concept.concept} despite practice`,
          suggestedActions: [
            `Try alternative learning resources for ${concept.concept}`,
            'Peer learning session',
            'Break concept into smaller parts'
          ]
        });
      });

      return recommendations;
    } catch (error) {
      logger.error('Error getting intervention recommendations:', error);
      throw new Error('Failed to get intervention recommendations');
    }
  }

  async getClassProgress(classId) {
    try {
      // Get class-wide progress
      const [classProgress] = await pool.query(
        `SELECT 
          pr.student_id,
          u.username as student_name,
          AVG(pr.mastery) as avg_mastery,
          COUNT(DISTINCT pr.concept) as concepts_attempted,
          SUM(pr.time_spent) as total_time
         FROM progress_records pr
         JOIN users u ON pr.student_id = u.user_id
         JOIN enrollments e ON u.user_id = e.user_id
         WHERE e.course_id = ?
         GROUP BY pr.student_id, u.username`,
        [classId]
      );

      // Get concept-specific progress
      const [conceptProgress] = await pool.query(
        `SELECT 
          pr.concept,
          AVG(pr.mastery) as class_avg_mastery,
          COUNT(DISTINCT pr.student_id) as students_attempted
         FROM progress_records pr
         JOIN enrollments e ON pr.student_id = e.user_id
         WHERE e.course_id = ?
         GROUP BY pr.concept`,
        [classId]
      );

      return {
        students: classProgress,
        concepts: conceptProgress
      };
    } catch (error) {
      logger.error('Error getting class progress:', error);
      throw new Error('Failed to get class progress');
    }
  }

  calculateTrend(dataPoints) {
    const n = dataPoints.length;
    const xSum = dataPoints.reduce((s, _, i) => s + i, 0);
    const ySum = dataPoints.reduce((s, y) => s + y, 0);
    const xySum = dataPoints.reduce((s, y, i) => s + i * y, 0);
    const xxSum = dataPoints.reduce((s, _, i) => s + i * i, 0);
    
    const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
    return slope;
  }
}

module.exports = new ProgressService(); 