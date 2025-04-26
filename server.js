require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./src/utils/logger');
const runMigrations = require('./src/db/migrate');
const errorHandler = require('./src/middleware/errorHandler');
const { setupTempDir, setupThumbnailCleanup } = require('./src/utils/setupTempDir');
const initializeDatabase = require('./src/utils/db').initializeDatabase;
const socketService = require('./src/services/socketService');
const { getAvailablePort } = require('./src/utils/portManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const backupPorts = [8000, 8001, 8002, 8003, 8004];

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup temp directory and thumbnail cleanup
setupTempDir();
setupThumbnailCleanup();

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
    // Initialize database and run migrations
    await initializeDatabase();
    await runMigrations();
    
    // Define ports to try
    const ports = [3000, 3001, 3002, 3003, 3004, 3005];
    let server;
    let port;

    // Try each port in sequence
    for (const p of ports) {
      try {
        port = p;
        server = await new Promise((resolve, reject) => {
          const s = httpServer.listen(p, () => resolve(s))
            .on('error', (err) => {
              if (err.code === 'EADDRINUSE') {
                logger.warn(`Port ${p} is already in use`);
                resolve(null);
              } else {
                reject(err);
              }
            });
        });
        if (server) break;
      } catch (err) {
        logger.error(`Error trying port ${p}:`, err);
      }
    }

    if (!server) {
      throw new Error('Could not find an available port');
    }

    logger.info(`Server running on port ${port}`);

    // Handle process termination
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
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