const socketio = require('socket.io');
const { verifyToken } = require('../utils/auth');
const Classroom = require('../models/Classroom');

let io;

const init = (server) => {
  io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }
      
      const decoded = verifyToken(token);
      socket.user = {
        user_id: decoded.user_id,
        username: decoded.username,
        role: decoded.role
      };
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id} (User: ${socket.user.user_id})`);

    // Join user to their personal room
    socket.join(`user-${socket.user.user_id}`);

    // Classroom signaling handlers
    setupClassroomHandlers(socket);
    setupWhiteboardHandlers(socket);
    setupChatHandlers(socket);

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
      cleanupPeerConnections(socket);
    });
  });
};

function setupClassroomHandlers(socket) {
  socket.on('join-classroom', async (classroom_id) => {
    try {
      const classroom = await Classroom.findById(classroom_id);
      if (!classroom || classroom.status !== 'live') {
        throw new Error('Classroom not available');
      }

      socket.join(`classroom-${classroom_id}`);
      console.log(`User ${socket.user.user_id} joined classroom ${classroom_id}`);

      // Notify others in the classroom
      socket.to(`classroom-${classroom_id}`).emit('user-joined', {
        user_id: socket.user.user_id,
        username: socket.user.username,
        isHost: classroom.creator_id === socket.user.user_id
      });

      // Send existing participants to the new user
      const participants = await Classroom.getParticipants(classroom_id);
      socket.emit('existing-participants', participants);
    } catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  });

  socket.on('webrtc-offer', (data) => {
    socket.to(`user-${data.to}`).emit('webrtc-offer', {
      offer: data.offer,
      from: socket.user.user_id,
      classroom_id: data.classroom_id
    });
  });

  socket.on('webrtc-answer', (data) => {
    socket.to(`user-${data.to}`).emit('webrtc-answer', {
      answer: data.answer,
      from: socket.user.user_id
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(`user-${data.to}`).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.user.user_id
    });
  });

  socket.on('toggle-media', (data) => {
    socket.to(`classroom-${data.classroom_id}`).emit('media-toggled', {
      user_id: socket.user.user_id,
      mediaType: data.mediaType,
      state: data.state
    });
  });
}

function setupWhiteboardHandlers(socket) {
  socket.on('whiteboard-draw', (data) => {
    socket.to(`classroom-${data.classroom_id}`).emit('whiteboard-draw', {
      ...data,
      from: socket.user.user_id
    });
  });

  socket.on('whiteboard-clear', (classroom_id) => {
    socket.to(`classroom-${classroom_id}`).emit('whiteboard-cleared', {
      from: socket.user.user_id
    });
  });
}

function setupChatHandlers(socket) {
  socket.on('send-message', async (data) => {
    try {
      const classroom = await Classroom.findById(data.classroom_id);
      if (!classroom) {
        throw new Error('Classroom not found');
      }

      const message = {
        sender_id: socket.user.user_id,
        username: socket.user.username,
        content: data.content,
        timestamp: new Date(),
        isSystem: false
      };

      io.to(`classroom-${data.classroom_id}`).emit('new-message', message);
    } catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  });
}

function cleanupPeerConnections(socket) {
  // Notify others in all classrooms about disconnection
  socket.rooms.forEach(room => {
    if (room.startsWith('classroom-')) {
      io.to(room).emit('user-left', {
        user_id: socket.user.user_id
      });
    }
  });
}

module.exports = {
  init,
  getIO: () => io
}; 