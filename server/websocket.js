const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    try {
      const token = req.url.split('token=')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.id;

      ws.on('message', (message) => {
        // Handle incoming messages if needed
      });

      ws.on('close', () => {
        // Handle connection closing
      });

    } catch (error) {
      ws.close();
    }
  });

  return wss;
};

module.exports = setupWebSocket;