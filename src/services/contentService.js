const { pool } = require('../utils/db');
const { ValidationError, NotFoundError } = require('../utils/errors');

class ContentService {
  async createContent(contentData) {
    const { title, body, type, created_by, language_code = 'en' } = contentData;

    // Validate input
    if (!title || !body || !type || !created_by) {
      throw new ValidationError('Missing required fields');
    }

    // Create content
    const [result] = await pool.query(
      'INSERT INTO content (title, body, type, created_by) VALUES (?, ?, ?, ?)',
      [title, body, type, created_by]
    );

    // Create localized content
    await pool.query(
      'INSERT INTO localized_content (content_id, language_code, translated_text) VALUES (?, ?, ?)',
      [result.insertId, language_code, body]
    );

    return this.getContentById(result.insertId);
  }

  async getContentById(contentId, languageCode = 'en') {
    const [content] = await pool.query(
      `SELECT c.*, lc.translated_text, u.username as creator_name
       FROM content c
       LEFT JOIN localized_content lc ON c.id = lc.content_id AND lc.language_code = ?
       LEFT JOIN users u ON c.created_by = u.user_id
       WHERE c.id = ?`,
      [languageCode, contentId]
    );

    if (content.length === 0) {
      throw new NotFoundError('Content not found');
    }

    return content[0];
  }

  async updateContent(contentId, contentData) {
    const { title, body, language_code = 'en' } = contentData;

    // Update content
    await pool.query(
      'UPDATE content SET title = ?, body = ? WHERE id = ?',
      [title, body, contentId]
    );

    // Update localized content
    await pool.query(
      `INSERT INTO localized_content (content_id, language_code, translated_text)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text)`,
      [contentId, language_code, body]
    );

    return this.getContentById(contentId, language_code);
  }

  async deleteContent(contentId) {
    // Delete localized content first
    await pool.query('DELETE FROM localized_content WHERE content_id = ?', [contentId]);
    
    // Delete main content
    await pool.query('DELETE FROM content WHERE id = ?', [contentId]);
  }

  async searchContent(query, languageCode = 'en') {
    const [content] = await pool.query(
      `SELECT c.*, lc.translated_text, u.username as creator_name
       FROM content c
       LEFT JOIN localized_content lc ON c.id = lc.content_id AND lc.language_code = ?
       LEFT JOIN users u ON c.created_by = u.user_id
       WHERE c.title LIKE ? OR lc.translated_text LIKE ?
       ORDER BY c.created_at DESC`,
      [languageCode, `%${query}%`, `%${query}%`]
    );

    return content;
  }
}

module.exports = new ContentService(); 