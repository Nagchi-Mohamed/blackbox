const net = require('net');
const logger = require('./logger');

const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

const getAvailablePort = async (startPort) => {
  let port = startPort;
  const maxPort = startPort + 10; // Try up to 10 ports
  
  while (port < maxPort) {
    const available = await isPortAvailable(port);
    if (available) {
      return port;
    }
    logger.warn(`Port ${port} is already in use, trying ${port + 1}`);
    port++;
  }
  
  throw new Error(`No available ports found between ${startPort} and ${maxPort}`);
};

module.exports = {
  isPortAvailable,
  getAvailablePort
}; 