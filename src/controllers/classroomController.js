const Classroom = require('../models/Classroom');
const { BadRequestError, ForbiddenError } = require('../errors');

const createClassroom = async (req, res) => {
  try {
    const { name, description, schedule, max_participants } = req.body;
    const creator_id = req.user.user_id;

    const classroom_id = await Classroom.create({
      creator_id,
      name,
      description,
      schedule: new Date(schedule),
      max_participants
    });

    // Add creator as host participant
    await Classroom.addParticipant(classroom_id, creator_id, 'host');

    const classroom = await Classroom.findById(classroom_id);

    res.status(201).json({
      success: true,
      data: { classroom }
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const joinClassroom = async (req, res) => {
  try {
    const classroom_id = req.params.id;
    const user_id = req.user.user_id;

    const classroom = await Classroom.findById(classroom_id);
    if (!classroom) {
      throw new BadRequestError('Classroom not found');
    }

    if (classroom.status !== 'scheduled') {
      throw new BadRequestError('Classroom is not available for joining');
    }

    const participants = await Classroom.getParticipants(classroom_id);
    if (participants.length >= classroom.max_participants) {
      throw new BadRequestError('Classroom is full');
    }

    const isParticipant = participants.some(p => p.user_id === user_id);
    if (isParticipant) {
      throw new BadRequestError('Already joined this classroom');
    }

    await Classroom.addParticipant(classroom_id, user_id);

    res.json({
      success: true,
      message: 'Successfully joined classroom'
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const startClassroom = async (req, res) => {
  try {
    const classroom_id = req.params.id;
    const user_id = req.user.user_id;

    const classroom = await Classroom.findById(classroom_id);
    if (!classroom) {
      throw new BadRequestError('Classroom not found');
    }

    if (classroom.creator_id !== user_id) {
      throw new ForbiddenError('Only the creator can start the classroom');
    }

    await Classroom.startSession(classroom_id);

    res.json({
      success: true,
      message: 'Classroom session started'
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const endClassroom = async (req, res) => {
  try {
    const classroom_id = req.params.id;
    const user_id = req.user.user_id;

    const classroom = await Classroom.findById(classroom_id);
    if (!classroom) {
      throw new BadRequestError('Classroom not found');
    }

    if (classroom.creator_id !== user_id) {
      throw new ForbiddenError('Only the creator can end the classroom');
    }

    await Classroom.endSession(classroom_id);

    res.json({
      success: true,
      message: 'Classroom session ended'
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const getClassroomDetails = async (req, res) => {
  try {
    const classroom_id = req.params.id;
    const classroom = await Classroom.findById(classroom_id);

    if (!classroom) {
      throw new BadRequestError('Classroom not found');
    }

    const participants = await Classroom.getParticipants(classroom_id);

    res.json({
      success: true,
      data: {
        classroom,
        participants
      }
    });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  createClassroom,
  joinClassroom,
  startClassroom,
  endClassroom,
  getClassroomDetails
}; 