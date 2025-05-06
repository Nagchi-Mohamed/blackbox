const { pool } = require('../utils/db');

class NotificationService {
  async createNotification(userId, type, message, metadata = {}) {
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, type, message, metadata) VALUES (?, ?, ?, ?)',
      [userId, type, message, JSON.stringify(metadata)]
    );
    return result.insertId;
  }

  async getUnreadNotifications(userId) {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? AND read_at IS NULL ORDER BY created_at DESC',
      [userId]
    );
    return notifications;
  }

  async markAsRead(notificationId) {
    await pool.query(
      'UPDATE notifications SET read_at = NOW() WHERE notification_id = ?',
      [notificationId]
    );
  }

  async getNotificationsByType(userId, type) {
    const [notifications] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? AND type = ? ORDER BY created_at DESC',
      [userId, type]
    );
    return notifications;
  }

  async createBatchNotifications(userIds, type, message, metadata = {}) {
    const placeholders = userIds.map(() => '(?, ?, ?, ?)').join(',');
    const values = userIds.flatMap(id => [id, type, message, JSON.stringify(metadata)]);
    
    const [result] = await pool.query(
      `INSERT INTO notifications (user_id, type, message, metadata) VALUES ${placeholders}`,
      values
    );
    return result.affectedRows;
  }
}

module.exports = new NotificationService();