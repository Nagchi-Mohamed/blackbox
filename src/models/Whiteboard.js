const pool = require('../utils/db');
const path = require('path');
const fs = require('fs');
const { fabric } = require('fabric');
const logger = require('../utils/logger');

class Whiteboard {
  static async getCurrentState(classroom_id) {
    const [rows] = await pool.query(
      `SELECT state_data FROM whiteboard_states 
       WHERE classroom_id = ?
       ORDER BY updated_at DESC LIMIT 1`,
      [classroom_id]
    );
    return rows[0]?.state_data;
  }

  static async saveState(classroom_id, state_data, user_id) {
    // Generate thumbnail
    const thumbnailPath = await this.generateThumbnail(state_data);
    
    const [result] = await pool.query(
      `INSERT INTO whiteboard_states 
       (classroom_id, state_data, created_by, thumbnail_path)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       state_data = VALUES(state_data),
       thumbnail_path = VALUES(thumbnail_path),
       updated_at = CURRENT_TIMESTAMP`,
      [classroom_id, state_data, user_id, thumbnailPath]
    );
    
    return result.insertId;
  }

  static async generateThumbnail(state_data) {
    try {
      const tempPath = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath, { recursive: true });
      }
      
      const thumbnailPath = path.join(tempPath, `thumbnail-${Date.now()}.png`);
      const canvas = new fabric.StaticCanvas(null, { width: 200, height: 150 });
      
      await new Promise((resolve) => {
        canvas.loadFromJSON(JSON.parse(state_data), () => {
          canvas.renderAll();
          const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 0.5
          });
          
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          fs.writeFile(thumbnailPath, base64Data, 'base64', (err) => {
            if (err) console.error('Error saving thumbnail:', err);
            canvas.dispose();
            resolve();
          });
        });
      });
      
      return thumbnailPath;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  }

  static async getHistory(classroom_id, limit = 10, searchQuery = '') {
    const recordings = await pool.query(`
      SELECT 
        ws.state_id,
        ws.state_data,
        ws.thumbnail_path,
        ws.created_at as state_created_at,
        u.username as created_by_name
      FROM whiteboard_states ws
      JOIN users u ON ws.created_by = u.user_id
      WHERE classroom_id = ?
      ${searchQuery ? `AND (u.username LIKE ? OR DATE(ws.created_at) = ?)` : ''}
      ORDER BY ws.created_at DESC
      LIMIT ?
    `, [classroom_id, ...(searchQuery ? [`%${searchQuery}%`, searchQuery] : []), limit]);
    return recordings;
  }

  static async getStateById(state_id) {
    const [rows] = await pool.query(
      `SELECT state_data FROM whiteboard_states WHERE state_id = ?`,
      [state_id]
    );
    return rows[0]?.state_data;
  }

  static async cleanupOldThumbnails(daysToKeep = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const [oldStates] = await pool.query(
      `SELECT thumbnail_path FROM whiteboard_states ws
       WHERE ws.created_at < ? AND thumbnail_path IS NOT NULL`,
      [cutoffDate]
    );

    oldStates.forEach(state => {
      if (state.thumbnail_path && fs.existsSync(state.thumbnail_path)) {
        fs.unlink(state.thumbnail_path, (err) => {
          if (err) console.error('Error deleting thumbnail:', err);
        });
      }
    });

    await pool.query(
      `UPDATE whiteboard_states ws SET thumbnail_path = NULL 
       WHERE ws.created_at < ?`,
      [cutoffDate]
    );
  }

  static async searchStates(params) {
    const {
      classroom_id,
      user_id,
      startDate,
      endDate,
      searchTerm,
      limit = 10,
      offset = 0
    } = params;

    let query = `
      SELECT 
        ws.state_id,
        ws.state_data,
        ws.thumbnail_path,
        ws.created_at,
        ws.updated_at,
        u.username as created_by_name,
        u.user_id as created_by_id
      FROM whiteboard_states ws
      JOIN users u ON ws.created_by = u.user_id
      WHERE 1=1
    `;

    const queryParams = [];

    if (classroom_id) {
      query += ` AND ws.classroom_id = ?`;
      queryParams.push(classroom_id);
    }

    if (user_id) {
      query += ` AND ws.created_by = ?`;
      queryParams.push(user_id);
    }

    if (startDate) {
      query += ` AND ws.created_at >= ?`;
      queryParams.push(new Date(startDate));
    }

    if (endDate) {
      query += ` AND ws.created_at <= ?`;
      queryParams.push(new Date(endDate));
    }

    if (searchTerm) {
      query += ` AND (
        u.username LIKE ? OR 
        DATE_FORMAT(ws.created_at, '%Y-%m-%d') = ? OR
        ws.state_data LIKE ?
      )`;
      queryParams.push(
        `%${searchTerm}%`,
        searchTerm,
        `%${searchTerm}%`
      );
    }

    // Get total count before applying limit
    const countQuery = query.replace(
      'SELECT ws.state_id, ws.state_data, ws.thumbnail_path, ws.created_at, ws.updated_at, u.username as created_by_name, u.user_id as created_by_id',
      'SELECT COUNT(*) as total'
    );
    const [countResult] = await pool.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Add sorting and pagination
    query += ` ORDER BY ws.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const [rows] = await pool.query(query, queryParams);

    // Convert thumbnails to base64
    const results = await Promise.all(rows.map(async (item) => {
      if (item.thumbnail_path && fs.existsSync(item.thumbnail_path)) {
        const thumbnailBase64 = fs.readFileSync(item.thumbnail_path, 'base64');
        item.thumbnail = `data:image/png;base64,${thumbnailBase64}`;
      }
      return item;
    }));

    return {
      states: results,
      total,
      limit,
      offset
    };
  }

  static async getState(stateId) {
    try {
      const [rows] = await pool.query(
        `SELECT state_id, state_data, thumbnail_path, created_at, u.username as created_by_name
         FROM whiteboard_states ws
         JOIN users u ON ws.created_by = u.user_id
         WHERE state_id = ?`,
        [stateId]
      );
      return rows[0];
    } catch (error) {
      logger.error('Error in Whiteboard.getState:', error);
      throw error;
    }
  }
}

module.exports = Whiteboard; 