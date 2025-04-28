const net = require('net');
const logger = require('./logger');

/**
 * Check if a port is available
 * @param {number} port - The port to check
 * @returns {Promise<boolean>} - True if port is available, false otherwise
 */
const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        
        server.listen(port);
    });
};

/**
 * Find an available port starting from the given port
 * @param {number} startPort - The port to start checking from
 * @returns {Promise<number>} - The first available port
 */
const getAvailablePort = async (startPort) => {
    let port = startPort;
    
    while (!(await isPortAvailable(port))) {
        port++;
    }
    
    logger.info(`Found available port: ${port}`);
    return port;
};

module.exports = {
    getAvailablePort
}; 