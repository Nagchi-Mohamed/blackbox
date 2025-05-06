require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brainymath', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/courses', require('./src/routes/courses'));
/* app.use('/api/whiteboard', require('./src/routes/whiteboard')); // Removed due to missing route file */
app.use('/api/recordings', require('./src/routes/recordings'));
app.use('/api/enrollments', require('./src/routes/enrollments'));
app.use('/api/lessons', require('./src/routes/lessons'));
app.use('/api/modules', require('./src/routes/modules'));
/* app.use('/api/interventions', require('./src/routes/interventionRoutes')); // Removed due to missing controller */
app.use('/api/reports', require('./src/routes/reportRoutes'));
app.use('/api/progress', require('./src/routes/progressRoutes'));
app.use('/api/adaptive', require('./src/routes/adaptiveRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/security', require('./src/routes/securityRoutes'));

const classroomsRouter = require('./server/routes/classrooms');
const classroomContentRouter = require('./server/routes/classroomContent');
app.use('/api/classrooms', classroomsRouter);
app.use('/api/classroomContent', classroomContentRouter);

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

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
