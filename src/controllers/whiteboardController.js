const Whiteboard = require('../models/Whiteboard');
const { BadRequestError, NotFoundError, ValidationError } = require('../utils/errors');
const logger = require('../utils/logger');

// Get whiteboard state
const getWhiteboardState = async (req, res, next) => {
  try {
    const state = await Whiteboard.getState(req.params.classroom_id);
    if (!state) {
      throw new NotFoundError('Whiteboard state not found');
    }

    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    next(error);
  }
};

// Save whiteboard state
const saveWhiteboardState = async (req, res, next) => {
  try {
    const { state_data } = req.body;
    if (!state_data) {
      throw new BadRequestError('State data is required');
    }

    const state = await Whiteboard.saveState({
      classroom_id: req.params.classroom_id,
      state_data,
      created_by: req.user.user_id
    });

    res.status(201).json({
      success: true,
      data: state
    });
  } catch (error) {
    next(error);
  }
};

// Get whiteboard history
const getWhiteboardHistory = async (req, res, next) => {
  try {
    const { classroom_id } = req.params;
    const { q: searchQuery } = req.query;
    const history = await Whiteboard.getHistory(classroom_id, 10, searchQuery);
    
    res.json({
      success: true,
      data: {
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search whiteboard states
const searchWhiteboardStates = async (req, res, next) => {
  try {
    const { classroom_id } = req.params;
    const { 
      user_id, 
      start_date, 
      end_date, 
      q: search_term,
      page = 1,
      limit = 10
    } = req.query;

    // Validate pagination parameters
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || isNaN(parsedLimit) || parsedPage < 1 || parsedLimit < 1) {
      throw new ValidationError('Invalid pagination parameters');
    }
    const offset = (parsedPage - 1) * parsedLimit;

    // Validate date format if provided
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (start_date && !dateRegex.test(start_date)) {
      throw new ValidationError('Invalid start_date format (YYYY-MM-DD required)');
    }
    if (end_date && !dateRegex.test(end_date)) {
      throw new ValidationError('Invalid end_date format (YYYY-MM-DD required)');
    }

    const results = await Whiteboard.searchStates({
      classroom_id,
      user_id,
      startDate: start_date,
      endDate: end_date,
      searchTerm: search_term,
      limit: parsedLimit,
      offset
    });

    res.json({
      success: true,
      data: {
        states: results.states,
        pagination: {
          total: results.total,
          page: parsedPage,
          pages: Math.ceil(results.total / parsedLimit),
          limit: parsedLimit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWhiteboardState,
  saveWhiteboardState,
  getWhiteboardHistory,
  searchWhiteboardStates
}; 