const Classroom = require('../models/Classroom');

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get classroom by ID
exports.getClassroomById = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new classroom
exports.createClassroom = async (req, res) => {
  try {
    const { name, section } = req.body;
    const teacher = req.user._id; // Assuming user is authenticated and user ID is in req.user
    const classroom = new Classroom({ name, section, teacher, students: [] });
    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Join a classroom
exports.joinClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    const userId = req.user._id;
    if (!classroom.students.includes(userId)) {
      classroom.students.push(userId);
      await classroom.save();
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Leave a classroom
exports.leaveClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    const userId = req.user._id;
    classroom.students = classroom.students.filter(id => id.toString() !== userId.toString());
    await classroom.save();
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
