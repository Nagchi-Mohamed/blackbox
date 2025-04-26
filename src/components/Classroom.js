import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import WebRTCManager from '../utils/WebRTCManager';
import Whiteboard from './Whiteboard';

const Classroom = () => {
  const { classroomId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const socketRef = useRef();
  const webrtcRef = useRef();
  const localVideoRef = useRef();
  const remoteVideosRef = useRef({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Initialize WebRTC
    const userId = localStorage.getItem('userId');
    webrtcRef.current = new WebRTCManager(userId);

    // Join classroom
    socketRef.current.emit('join-classroom', {
      classroom_id: classroomId
    });

    // Handle local stream
    webrtcRef.current.init(socketRef.current, classroomId)
      .then(localStream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      })
      .catch(error => {
        console.error('Failed to initialize WebRTC:', error);
      });

    // Handle remote streams
    webrtcRef.current.onRemoteStream = (userId, stream) => {
      if (remoteVideosRef.current[userId]) {
        remoteVideosRef.current[userId].srcObject = stream;
      }
    };

    // Handle chat messages
    socketRef.current.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Handle participant updates
    socketRef.current.on('participants-update', (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      webrtcRef.current.cleanup();
      socketRef.current.disconnect();
    };
  }, [classroomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      text: newMessage,
      user_id: localStorage.getItem('userId'),
      timestamp: new Date().toISOString()
    };

    socketRef.current.emit('chat-message', {
      message,
      classroom_id: classroomId
    });

    setNewMessage('');
  };

  const toggleWhiteboard = () => {
    setIsWhiteboardActive(!isWhiteboardActive);
  };

  return (
    <div className="classroom-container">
      <div className="video-grid">
        <div className="local-video">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="video-element"
          />
          <span className="video-label">You</span>
        </div>
        
        {participants.map(participant => (
          <div key={participant.user_id} className="remote-video">
            <video
              ref={el => remoteVideosRef.current[participant.user_id] = el}
              autoPlay
              playsInline
              className="video-element"
            />
            <span className="video-label">{participant.name}</span>
          </div>
        ))}
      </div>

      <div className="classroom-controls">
        <button onClick={toggleWhiteboard}>
          {isWhiteboardActive ? 'Hide Whiteboard' : 'Show Whiteboard'}
        </button>
      </div>

      {isWhiteboardActive && (
        <div className="whiteboard-container">
          <Whiteboard
            socket={socketRef.current}
            classroomId={classroomId}
          />
        </div>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <span className="message-sender">{message.user_id}</span>
              <span className="message-text">{message.text}</span>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Classroom; 