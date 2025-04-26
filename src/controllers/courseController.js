const Course = require('../models/Course');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const logger = require('../utils/logger');

// Get all courses with pagination
exports.getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const courses = await Course.findAll(limit, offset);
    res.json({
      status: 'success',
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// Get a single course
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    res.json({
      status: 'success',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Create a new course
exports.createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      throw new BadRequestError('Title is required');
    }

    const course = await Course.create({
      title,
      description,
      created_by: req.user.user_id
    });

    res.status(201).json({
      status: 'success',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Update a course
exports.updateCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    if (course.created_by !== req.user.user_id && req.user.role !== 'admin') {
      throw new BadRequestError('You are not authorized to update this course');
    }

    const updatedCourse = await Course.update(req.params.id, {
      title,
      description
    });

    res.json({
      status: 'success',
      data: updatedCourse
    });
  } catch (error) {
    next(error);
  }
};

// Delete a course
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    await Course.delete(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    await Course.enroll(req.params.id, req.user.user_id);

    res.status(201).json({
      status: 'success',
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    next(error);
  }
}; 