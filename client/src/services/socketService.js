import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

export const connectSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!socket.connected) {
        socket.connect();
        
        socket.on('connect', () => {
          console.log('Socket connected successfully');
          resolve(true);
        });

        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });
      } else {
        resolve(true);
      }
    } catch (error) {
      console.error('Socket connection error:', error);
      reject(error);
    }
  });
};

export const disconnectSocket = () => {
  return new Promise((resolve) => {
    try {
      if (socket.connected) {
        socket.disconnect();
        console.log('Socket disconnected successfully');
      }
      resolve(true);
    } catch (error) {
      console.error('Socket disconnection error:', error);
      resolve(false);
    }
  });
};

export const joinRoom = (roomId) => {
  return new Promise((resolve, reject) => {
    try {
      if (!socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      socket.emit('join-room', roomId);
      resolve(true);
    } catch (error) {
      console.error('Error joining room:', error);
      reject(error);
    }
  });
};

export const leaveRoom = (roomId) => {
  return new Promise((resolve, reject) => {
    try {
      if (!socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      socket.emit('leave-room', roomId);
      resolve(true);
    } catch (error) {
      console.error('Error leaving room:', error);
      reject(error);
    }
  });
};

export const onSocketEvent = (event, callback) => {
  if (typeof event !== 'string' || typeof callback !== 'function') {
    throw new Error('Invalid event or callback');
  }
  socket.on(event, callback);
  
  // Return cleanup function
  return () => offSocketEvent(event, callback);
};

export const offSocketEvent = (event, callback) => {
  if (typeof event !== 'string' || typeof callback !== 'function') {
    throw new Error('Invalid event or callback');
  }
  socket.off(event, callback);
};

export const emitEvent = (event, data) => {
  return new Promise((resolve, reject) => {
    try {
      if (!socket.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit(event, data, (response) => {
        if (response?.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      console.error('Error emitting event:', error);
      reject(error);
    }
  });
};

// Listen for reconnection events
socket.on('reconnect', (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed');
});

export { socket };
export default socket;
