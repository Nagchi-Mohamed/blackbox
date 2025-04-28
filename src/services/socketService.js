const logger = require('../utils/logger');

const socketService = {
  initialize: (io) => {
    io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }
};

module.exports = socketService; 