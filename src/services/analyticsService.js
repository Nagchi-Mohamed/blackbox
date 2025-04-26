const { pool } = require('../utils/db');
const { ValidationError } = require('../utils/errors');

class AnalyticsService {
  async trackUserActivity(userId, activityType, metadata = {}) {
    if (!userId || !activityType) {
      throw new ValidationError('Missing required fields');
    }

    await pool.query(
      'INSERT INTO user_activity (user_id, activity_type, metadata) VALUES (?, ?, ?)',
      [userId, activityType, JSON.stringify(metadata)]
    );
  }

  async getUserActivityStats(userId, startDate, endDate) {
    const [stats] = await pool.query(
      `SELECT activity_type, COUNT(*) as count
       FROM user_activity
       WHERE user_id = ? AND created_at BETWEEN ? AND ?
       GROUP BY activity_type`,
      [userId, startDate, endDate]
    );

    return stats;
  }

  async getCourseEngagementStats(courseId) {
    const [stats] = await pool.query(
      `SELECT 
         COUNT(DISTINCT ua.user_id) as active_users,
         COUNT(DISTINCT CASE WHEN ua.activity_type = 'view_content' THEN ua.user_id END) as content_viewers,
         COUNT(DISTINCT CASE WHEN ua.activity_type = 'complete_exercise' THEN ua.user_id END) as exercise_completers,
         AVG(CASE WHEN ua.activity_type = 'exercise_score' THEN CAST(ua.metadata->>'$.score' AS DECIMAL) END) as avg_score
       FROM user_activity ua
       JOIN enrollments e ON ua.user_id = e.user_id
       WHERE e.course_id = ?`,
      [courseId]
    );

    return stats[0];
  }

  async getClassroomStats(classroomId) {
    const [stats] = await pool.query(
      `SELECT 
         COUNT(DISTINCT ua.user_id) as active_participants,
         COUNT(DISTINCT CASE WHEN ua.activity_type = 'whiteboard_interaction' THEN ua.user_id END) as whiteboard_users,
         COUNT(DISTINCT CASE WHEN ua.activity_type = 'breakout_participation' THEN ua.user_id END) as breakout_participants,
         AVG(CASE WHEN ua.activity_type = 'session_duration' THEN CAST(ua.metadata->>'$.duration' AS DECIMAL) END) as avg_session_duration
       FROM user_activity ua
       WHERE ua.metadata->>'$.classroomId' = ?`,
      [classroomId]
    );

    return stats[0];
  }

  async getForumStats() {
    const [stats] = await pool.query(
      `SELECT 
         COUNT(DISTINCT p.id) as total_posts,
         COUNT(DISTINCT c.id) as total_comments,
         COUNT(DISTINCT p.user_id) as active_authors,
         AVG(comment_count) as avg_comments_per_post
       FROM forum_posts p
       LEFT JOIN forum_comments c ON p.id = c.post_id
       LEFT JOIN (
         SELECT post_id, COUNT(*) as comment_count
         FROM forum_comments
         GROUP BY post_id
       ) cc ON p.id = cc.post_id`
    );

    return stats[0];
  }

  async getContentEngagementStats(contentId) {
    const [stats] = await pool.query(
      `SELECT 
         COUNT(DISTINCT ua.user_id) as total_viewers,
         AVG(CASE WHEN ua.activity_type = 'content_duration' THEN CAST(ua.metadata->>'$.duration' AS DECIMAL) END) as avg_view_duration,
         COUNT(DISTINCT CASE WHEN ua.activity_type = 'content_completion' THEN ua.user_id END) as completions
       FROM user_activity ua
       WHERE ua.metadata->>'$.contentId' = ?`,
      [contentId]
    );

    return stats[0];
  }

  async getSystemWideStats() {
    const [stats] = await pool.query(
      `SELECT 
         (SELECT COUNT(*) FROM users) as total_users,
         (SELECT COUNT(*) FROM courses) as total_courses,
         (SELECT COUNT(*) FROM classrooms) as total_classrooms,
         (SELECT COUNT(*) FROM forum_posts) as total_forum_posts,
         (SELECT COUNT(*) FROM user_activity WHERE activity_type = 'login') as total_logins
       FROM dual`
    );

    return stats[0];
  }
}

module.exports = new AnalyticsService(); 