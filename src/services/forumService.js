const { pool } = require('../utils/db');
const { ValidationError, NotFoundError } = require('../utils/errors');

class ForumService {
  async createPost(postData) {
    const { title, content, user_id, category_id } = postData;

    if (!title || !content || !user_id || !category_id) {
      throw new ValidationError('Missing required fields');
    }

    const [result] = await pool.query(
      'INSERT INTO forum_posts (title, content, user_id, category_id) VALUES (?, ?, ?, ?)',
      [title, content, user_id, category_id]
    );

    return this.getPostById(result.insertId);
  }

  async getPostById(postId) {
    const [posts] = await pool.query(
      `SELECT p.*, u.username as author_name, c.name as category_name
       FROM forum_posts p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN forum_categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [postId]
    );

    if (posts.length === 0) {
      throw new NotFoundError('Post not found');
    }

    return posts[0];
  }

  async createComment(commentData) {
    const { content, user_id, post_id } = commentData;

    if (!content || !user_id || !post_id) {
      throw new ValidationError('Missing required fields');
    }

    const [result] = await pool.query(
      'INSERT INTO forum_comments (content, user_id, post_id) VALUES (?, ?, ?)',
      [content, user_id, post_id]
    );

    return this.getCommentById(result.insertId);
  }

  async getCommentById(commentId) {
    const [comments] = await pool.query(
      `SELECT c.*, u.username as author_name
       FROM forum_comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.id = ?`,
      [commentId]
    );

    if (comments.length === 0) {
      throw new NotFoundError('Comment not found');
    }

    return comments[0];
  }

  async getPostsByCategory(categoryId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [posts] = await pool.query(
      `SELECT p.*, u.username as author_name, c.name as category_name,
              (SELECT COUNT(*) FROM forum_comments WHERE post_id = p.id) as comment_count
       FROM forum_posts p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN forum_categories c ON p.category_id = c.id
       WHERE p.category_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [categoryId, limit, offset]
    );

    return posts;
  }

  async searchPosts(query, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [posts] = await pool.query(
      `SELECT p.*, u.username as author_name, c.name as category_name,
              (SELECT COUNT(*) FROM forum_comments WHERE post_id = p.id) as comment_count
       FROM forum_posts p
       LEFT JOIN users u ON p.user_id = u.user_id
       LEFT JOIN forum_categories c ON p.category_id = c.id
       WHERE p.title LIKE ? OR p.content LIKE ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${query}%`, `%${query}%`, limit, offset]
    );

    return posts;
  }

  async getCommentsByPost(postId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [comments] = await pool.query(
      `SELECT c.*, u.username as author_name
       FROM forum_comments c
       LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC
       LIMIT ? OFFSET ?`,
      [postId, limit, offset]
    );

    return comments;
  }

  async createCategory(categoryData) {
    const { name, description } = categoryData;

    if (!name) {
      throw new ValidationError('Category name is required');
    }

    const [result] = await pool.query(
      'INSERT INTO forum_categories (name, description) VALUES (?, ?)',
      [name, description]
    );

    return {
      id: result.insertId,
      name,
      description
    };
  }

  async getAllCategories() {
    const [categories] = await pool.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM forum_posts WHERE category_id = c.id) as post_count
       FROM forum_categories c
       ORDER BY c.name ASC`
    );

    return categories;
  }
}

module.exports = new ForumService(); 