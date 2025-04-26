const pool = require('../utils/db');

class Module {
  static async create({ course_id, title, description, sequence_order }) {
    const [result] = await pool.query(
      `INSERT INTO modules 
      (course_id, title, description, sequence_order) 
      VALUES (?, ?, ?, ?)`,
      [course_id, title, description, sequence_order]
    );
    return result.insertId;
  }

  static async findByCourseId(course_id) {
    const [rows] = await pool.query(
      `SELECT * FROM modules 
       WHERE course_id = ? 
       ORDER BY sequence_order ASC`,
      [course_id]
    );
    return rows;
  }

  static async findById(module_id) {
    const [rows] = await pool.query(
      `SELECT m.*, c.title as course_title 
       FROM modules m
       JOIN courses c ON m.course_id = c.course_id
       WHERE m.module_id = ?`,
      [module_id]
    );
    return rows[0];
  }

  static async update(module_id, updates) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
    
    params.push(module_id);
    
    await pool.query(
      `UPDATE modules SET ${fields.join(', ')} WHERE module_id = ?`,
      params
    );
  }

  static async delete(module_id) {
    await pool.query('DELETE FROM modules WHERE module_id = ?', [module_id]);
  }

  static async reorder(course_id, module_ids) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      for (let i = 0; i < module_ids.length; i++) {
        await connection.query(
          'UPDATE modules SET sequence_order = ? WHERE module_id = ? AND course_id = ?',
          [i + 1, module_ids[i], course_id]
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

module.exports = Module; 