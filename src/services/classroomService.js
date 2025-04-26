const { pool } = require('../utils/db');
const { ValidationError, NotFoundError } = require('../utils/errors');
const socketService = require('./socketService');

class ClassroomService {
  constructor() {
    this.activeRooms = new Map();
    this.initializeSocketHandlers();
  }

  initializeSocketHandlers() {
    socketService.io.on('connection', (socket) => {
      // Join classroom
      socket.on('join_classroom', async (data) => {
        const { classroomId, userId } = data;
        await this.joinClassroom(socket, classroomId, userId);
      });

      // Leave classroom
      socket.on('leave_classroom', async (data) => {
        const { classroomId, userId } = data;
        await this.leaveClassroom(socket, classroomId, userId);
      });

      // Whiteboard events
      socket.on('whiteboard_update', async (data) => {
        const { classroomId, state } = data;
        await this.updateWhiteboardState(classroomId, state);
      });

      // Breakout room events
      socket.on('create_breakout', async (data) => {
        const { classroomId, name } = data;
        await this.createBreakoutRoom(classroomId, name);
      });

      socket.on('join_breakout', async (data) => {
        const { classroomId, breakoutId, userId } = data;
        await this.joinBreakoutRoom(socket, classroomId, breakoutId, userId);
      });
    });
  }

  async createClassroom(classroomData) {
    const { title, course_id, created_by } = classroomData;

    if (!title || !course_id || !created_by) {
      throw new ValidationError('Missing required fields');
    }

    const [result] = await pool.query(
      'INSERT INTO classrooms (title, course_id, created_by) VALUES (?, ?, ?)',
      [title, course_id, created_by]
    );

    return this.getClassroomById(result.insertId);
  }

  async getClassroomById(classroomId) {
    const [classrooms] = await pool.query(
      `SELECT c.*, u.username as creator_name
       FROM classrooms c
       LEFT JOIN users u ON c.created_by = u.user_id
       WHERE c.id = ?`,
      [classroomId]
    );

    if (classrooms.length === 0) {
      throw new NotFoundError('Classroom not found');
    }

    return classrooms[0];
  }

  async joinClassroom(socket, classroomId, userId) {
    const classroom = await this.getClassroomById(classroomId);
    
    // Join socket room
    socket.join(`classroom_${classroomId}`);
    
    // Add to active users
    if (!this.activeRooms.has(classroomId)) {
      this.activeRooms.set(classroomId, new Set());
    }
    this.activeRooms.get(classroomId).add(userId);

    // Notify others
    socket.to(`classroom_${classroomId}`).emit('user_joined', {
      userId,
      classroomId
    });

    return classroom;
  }

  async leaveClassroom(socket, classroomId, userId) {
    // Leave socket room
    socket.leave(`classroom_${classroomId}`);
    
    // Remove from active users
    if (this.activeRooms.has(classroomId)) {
      this.activeRooms.get(classroomId).delete(userId);
    }

    // Notify others
    socket.to(`classroom_${classroomId}`).emit('user_left', {
      userId,
      classroomId
    });
  }

  async updateWhiteboardState(classroomId, state) {
    // Save state to database
    await pool.query(
      'INSERT INTO whiteboard_states (classroom_id, state_data) VALUES (?, ?)',
      [classroomId, JSON.stringify(state)]
    );

    // Broadcast to all users in classroom
    socketService.io.to(`classroom_${classroomId}`).emit('whiteboard_updated', {
      classroomId,
      state
    });
  }

  async createBreakoutRoom(classroomId, name) {
    const [result] = await pool.query(
      'INSERT INTO breakout_rooms (classroom_id, name) VALUES (?, ?)',
      [classroomId, name]
    );

    const breakoutRoom = {
      id: result.insertId,
      classroomId,
      name
    };

    // Notify all users in classroom
    socketService.io.to(`classroom_${classroomId}`).emit('breakout_created', breakoutRoom);

    return breakoutRoom;
  }

  async joinBreakoutRoom(socket, classroomId, breakoutId, userId) {
    // Join socket room
    socket.join(`breakout_${breakoutId}`);
    
    // Notify others in breakout room
    socket.to(`breakout_${breakoutId}`).emit('user_joined_breakout', {
      userId,
      breakoutId
    });
  }
}

module.exports = new ClassroomService(); 