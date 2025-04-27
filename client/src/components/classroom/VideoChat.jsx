import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'antd';
import socket, { onSocketEvent, offSocketEvent } from '../../services/socketService';
import './VideoChat.less';

const VideoChat = ({ roomId }) => {
  const [participants, setParticipants] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    // Set up socket listeners
    onSocketEvent('participants-update', (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    // Cleanup on unmount
    return () => {
      offSocketEvent('participants-update');
    };
  }, []);

  return (
    <Card title="Video Chat" className="video-chat">
      <div className="video-grid">
        {participants.map((participant) => (
          <div key={participant.id} className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={participant.id === socket.id}
            />
            <div className="participant-name">{participant.name}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VideoChat; 