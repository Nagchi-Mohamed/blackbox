const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const Course = require('../models/Course');
const { BadRequestError } = require('../errors');

const createLesson = async (req, res) => {
  try {
    const { module_id, title, content_type, content_text, duration_minutes, is_free_preview } = req.body;
    
    // Verify module exists
    const module = await Module.findById(module_id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(module.course_id);
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Handle file upload if exists
    let content_url = null;
    if (req.file) {
      content_url = `/uploads/${req.file.filename}`;
    }
    
    // Get current highest sequence order
    const lessons = await Lesson.findByModuleId(module_id);
    const sequence_order = lessons.data.length + 1;
    
    const lesson_id = await Lesson.create({
      module_id,
      title,
      content_type,
      content_url,
      content_text,
      duration_minutes: parseInt(duration_minutes),
      sequence_order,
      is_free_preview: Boolean(is_free_preview)
    });
    
    const lesson = await Lesson.findById(lesson_id);
    
    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getLessons = async (req, res) => {
  try {
    const { module_id } = req.params;
    const { 
      page = 1, 
      limit = 10,
      search = '',
      contentType = '',
      isFreePreview,
      sort = 'sequence_order:ASC'
    } = req.query;

    // Convert isFreePreview to boolean if provided
    let freePreviewFilter = null;
    if (isFreePreview !== undefined) {
      freePreviewFilter = isFreePreview === 'true';
    }

    // Verify module exists
    const module = await Module.findById(module_id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    const result = await Lesson.findByModuleId(module_id, {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      contentType,
      isFreePreview: freePreviewFilter,
      sort
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: {
        search,
        contentType,
        isFreePreview: freePreviewFilter
      },
      sort: result.sort
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
};

const getLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    
    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Verify lesson exists
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    
    // Verify module exists
    const module = await Module.findById(lesson.module_id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(module.course_id);
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Handle file upload if exists
    if (req.file) {
      updates.content_url = `/uploads/${req.file.filename}`;
    }
    
    await Lesson.update(id, updates);
    const updatedLesson = await Lesson.findById(id);
    
    res.json({
      success: true,
      data: updatedLesson
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify lesson exists
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }
    
    // Verify module exists
    const module = await Module.findById(lesson.module_id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(module.course_id);
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await Lesson.delete(id);
    
    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const reorderLessons = async (req, res) => {
  try {
    const { module_id } = req.params;
    const { lesson_ids } = req.body;
    
    // Verify module exists
    const module = await Module.findById(module_id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(module.course_id);
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await Lesson.reorder(module_id, lesson_ids);
    
    const lessons = await Lesson.findByModuleId(module_id);
    
    res.json({
      success: true,
      data: lessons.data,
      pagination: lessons.pagination,
      sort: lessons.sort
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  reorderLessons
}; 