const net = require('net');
const logger = require('./logger');

async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
}

async function getAvailablePort(startPort = 8000, maxAttempts = 10) {
  try {
    const port = await findAvailablePort(startPort);
    logger.info(`Found available port: ${port}`);
    return port;
  } catch (error) {
    if (maxAttempts > 0) {
      logger.warn(`Failed to find port ${startPort}, trying ${startPort + 1}`);
      return getAvailablePort(startPort + 1, maxAttempts - 1);
    }
    throw new Error('Could not find an available port');
  }
}

module.exports = {
  getAvailablePort
}; 