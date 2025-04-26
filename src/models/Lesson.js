const pool = require('../utils/db');

class Lesson {
  static async create({
    module_id,
    title,
    content_type,
    content_url,
    content_text,
    duration_minutes,
    sequence_order,
    is_free_preview = false
  }) {
    const [result] = await pool.query(
      `INSERT INTO lessons 
      (module_id, title, content_type, content_url, content_text, duration_minutes, sequence_order, is_free_preview) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [module_id, title, content_type, content_url, content_text, duration_minutes, sequence_order, is_free_preview]
    );
    return result.insertId;
  }

  static async findByModuleId(module_id, { 
    page = 1, 
    limit = 10,
    search = '',
    contentType = '',
    isFreePreview = null,
    sort = 'sequence_order:ASC' // Default sort
  } = {}) {
    const offset = (page - 1) * limit;
    
    // Validate and parse sort parameters
    const validSortFields = ['sequence_order', 'title', 'duration_minutes', 'created_at'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const sortClauses = [];
    const sortParams = sort.split(',');
    
    for (const param of sortParams) {
      const [field, order = 'ASC'] = param.split(':');
      
      if (validSortFields.includes(field) && validSortOrders.includes(order.toUpperCase())) {
        sortClauses.push(`${field} ${order}`);
      }
    }
    
    // Default to sequence_order if no valid sorts
    if (sortClauses.length === 0) {
      sortClauses.push('sequence_order ASC');
    }

    let query = `SELECT * FROM lessons WHERE module_id = ?`;
    const params = [module_id];
    
    // Add search condition
    if (search) {
      query += ` AND (title LIKE ? OR content_text LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Add content type filter
    if (contentType) {
      query += ` AND content_type = ?`;
      params.push(contentType);
    }
    
    // Add free preview filter
    if (isFreePreview !== null) {
      query += ` AND is_free_preview = ?`;
      params.push(Boolean(isFreePreview));
    }
    
    query += ` ORDER BY ${sortClauses.join(', ')} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const [rows] = await pool.query(query, params);

    // Get total count with same filters (without sorting)
    let countQuery = `SELECT COUNT(*) as total FROM lessons WHERE module_id = ?`;
    const countParams = [module_id];
    
    if (search) {
      countQuery += ` AND (title LIKE ? OR content_text LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (contentType) {
      countQuery += ` AND content_type = ?`;
      countParams.push(contentType);
    }
    
    if (isFreePreview !== null) {
      countQuery += ` AND is_free_preview = ?`;
      countParams.push(Boolean(isFreePreview));
    }
    
    const [countRows] = await pool.query(countQuery, countParams);

    return {
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countRows[0].total / limit)
      },
      sort: {
        by: sortClauses
      }
    };
  }

  static async findById(lesson_id) {
    const [rows] = await pool.query(
      `SELECT l.*, m.title as module_title, c.title as course_title
       FROM lessons l
       JOIN modules m ON l.module_id = m.module_id
       JOIN courses c ON m.course_id = c.course_id
       WHERE l.lesson_id = ?`,
      [lesson_id]
    );
    return rows[0];
  }

  static async update(lesson_id, updates) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    
    params.push(lesson_id);
    
    await pool.query(
      `UPDATE lessons SET ${fields.join(', ')} WHERE lesson_id = ?`,
      params
    );
  }

  static async delete(lesson_id) {
    await pool.query('DELETE FROM lessons WHERE lesson_id = ?', [lesson_id]);
  }

  static async reorder(module_id, lesson_ids) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      for (let i = 0; i < lesson_ids.length; i++) {
        await connection.query(
          'UPDATE lessons SET sequence_order = ? WHERE lesson_id = ? AND module_id = ?',
          [i + 1, lesson_ids[i], module_id]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Lesson; 