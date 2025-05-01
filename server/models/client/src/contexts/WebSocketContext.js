import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (token) {
      const ws = new WebSocket(`ws://localhost:${process.env.REACT_APP_WS_PORT}?token=${token}`);
      
      ws.onopen = () => {
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'achievement') {
          setNotifications(prev => [...prev, message.data]);
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [token]);

  return (
    <WebSocketContext.Provider value={{ socket, notifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;