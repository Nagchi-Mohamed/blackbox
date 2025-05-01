const mongoose = require('mongoose');
const User = require('../models/User');

class AnalyticsService {
  async getStudentProgress(userId) {
    return await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(userId) } },
      { $unwind: '$progress' },
      {
        $lookup: {
          from: 'courses',
          localField: 'progress.courseId',
          foreignField: '_id',
          as: 'courseDetails'
        }
      },
      { $unwind: '$courseDetails' },
      {
        $project: {
          courseId: '$progress.courseId',
          completion: '$progress.completion',
          courseTitle: '$courseDetails.title'
        }
      }
    ]);
  }

  // Removed getClassroomEngagement method as classroom feature is removed
}

module.exports = new AnalyticsService();