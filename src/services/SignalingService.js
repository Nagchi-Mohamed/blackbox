const socketio = require('socket.io');
const RoomManager = require('./RoomManager');

class SignalingService {
  constructor(server) {
    this.io = socketio(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
      }
    });
    this.rooms = new RoomManager();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`New connection: ${socket.id}`);

      // Room management
      socket.on('join-room', ({ roomId, userId }) => {
        socket.join(roomId);
        this.rooms.addUser(roomId, userId, socket.id);
        
        // Notify others in the room
        socket.to(roomId).emit('user-joined', userId);
        
        console.log(`User ${userId} joined room ${roomId}`);
      });

      socket.on('leave-room', ({ roomId, userId }) => {
        socket.leave(roomId);
        this.rooms.removeUser(roomId, userId);
        
        // Notify others in the room
        socket.to(roomId).emit('user-left', userId);
        
        console.log(`User ${userId} left room ${roomId}`);
      });

      // WebRTC signaling
      socket.on('offer', ({ target, offer }) => {
        const targetSocket = this.rooms.getUserSocket(target);
        if (targetSocket) {
          socket.to(targetSocket).emit('offer', { 
            sender: socket.id, 
            offer 
          });
        }
      });

      socket.on('answer', ({ target, answer }) => {
        const targetSocket = this.rooms.getUserSocket(target);
        if (targetSocket) {
          socket.to(targetSocket).emit('answer', { 
            sender: socket.id, 
            answer 
          });
        }
      });

      socket.on('ice-candidate', ({ target, candidate }) => {
        const targetSocket = this.rooms.getUserSocket(target);
        if (targetSocket) {
          socket.to(targetSocket).emit('ice-candidate', { 
            sender: socket.id, 
            candidate 
          });
        }
      });

      // Whiteboard collaboration
      socket.on('join-whiteboard', ({ roomId }) => {
        socket.join(`${roomId}-whiteboard`);
      });

      socket.on('leave-whiteboard', ({ roomId }) => {
        socket.leave(`${roomId}-whiteboard`);
      });

      socket.on('whiteboard-operation', ({ roomId, operation }) => {
        socket.to(`${roomId}-whiteboard`).emit('whiteboard-operation', operation);
      });

      socket.on('disconnect', () => {
        const userRooms = this.rooms.removeSocket(socket.id);
        userRooms.forEach(roomId => {
          socket.to(roomId).emit('user-left', socket.id);
        });
      });
    });
  }
}

module.exports = SignalingService; 