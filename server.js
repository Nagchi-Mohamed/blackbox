require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./src/utils/logger');
const mongoose = require('mongoose');
const errorHandler = require('./src/middleware/errorHandler');
const { setupTempDir, setupThumbnailCleanup } = require('./src/utils/setupTempDir');
const socketService = require('./src/services/socketService');
const { getAvailablePort } = require('./src/utils/portManager');
const path = require('path');
const setupSwagger = require('./src/swagger');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup temp directory and thumbnail cleanup
setupTempDir();
setupThumbnailCleanup();

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/classroom', require('./src/routes/classroom'));
app.use('/api/whiteboard', require('./src/routes/whiteboard'));
app.use('/api/recordings', require('./src/routes/recordings'));
app.use('/api/enrollments', require('./src/routes/enrollments'));
app.use('/api/lessons', require('./src/routes/lessons'));
app.use('/api/modules', require('./src/routes/modules'));
app.use('/api/interventions', require('./src/routes/interventionRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));
app.use('/api/progress', require('./src/routes/progressRoutes'));
app.use('/api/adaptive', require('./src/routes/adaptiveRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/security', require('./src/routes/securityRoutes'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-classroom', (classroomId) => {
    socket.join(`classroom-${classroomId}`);
    logger.info(`Client ${socket.id} joined classroom ${classroomId}`);
  });

  socket.on('leave-classroom', (classroomId) => {
    socket.leave(`classroom-${classroomId}`);
    logger.info(`Client ${socket.id} left classroom ${classroomId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brainymath', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');

    // Get available port
    const port = await getAvailablePort(process.env.PORT || 5000);
    
    httpServer.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      httpServer.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 