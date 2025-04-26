const Module = require('../models/Module');
const Course = require('../models/Course');

const createModule = async (req, res) => {
  try {
    const { course_id, title, description } = req.body;
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Get current highest sequence order
    const modules = await Module.findByCourseId(course_id);
    const sequence_order = modules.length + 1;
    
    const module_id = await Module.create({
      course_id,
      title,
      description,
      sequence_order
    });
    
    const module = await Module.findById(module_id);
    
    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getModules = async (req, res) => {
  try {
    const { course_id } = req.params;
    
    // Verify course exists
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const modules = await Module.findByCourseId(course_id);
    
    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getModule = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await Module.findById(id);
    
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    res.json({
      success: true,
      data: module
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Verify module exists
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(module.course_id);
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await Module.update(id, updates);
    const updatedModule = await Module.findById(id);
    
    res.json({
      success: true,
      data: updatedModule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify module exists
    const module = await Module.findById(id);
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(module.course_id);
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await Module.delete(id);
    
    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const reorderModules = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { module_ids } = req.body;
    
    // Verify course exists and user is creator or admin
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    if (course.created_by !== req.user.user_id && req.user.user_type !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await Module.reorder(course_id, module_ids);
    
    const modules = await Module.findByCourseId(course_id);
    
    res.json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  reorderModules
}; 