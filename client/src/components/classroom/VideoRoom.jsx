import React, { useEffect, useRef, useState } from 'react';
import { Button, Space, Avatar } from 'antd';
import { WebRTCHandler } from '../../utils/WebRTCHandler';
import { socket } from '../../utils/socket';

const VideoRoom = ({ roomId, userId, isTeacher }) => {
  const [participants, setParticipants] = useState([]);
  const webRTCRef = useRef(new WebRTCHandler());
  const videoRefs = useRef({});
  const localVideoRef = useRef();

  useEffect(() => {
    const webRTC = webRTCRef.current;
    webRTC.socket = socket;
    webRTC.onRemoteStream = (userId, stream) => {
      setParticipants(prev => {
        const existing = prev.find(p => p.id === userId);
        if (!existing) {
          return [...prev, { id: userId, stream }];
        }
        return prev;
      });
    };

    // Initialize local stream
    webRTC.initLocalStream().then(stream => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    });

    // Socket event handlers
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    // Join the room
    socket.emit('join-room', { roomId, userId });

    return () => {
      webRTC.cleanup();
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.emit('leave-room', { roomId, userId });
    };
  }, [roomId, userId]);

  const handleUserJoined = async (newUserId) => {
    if (newUserId !== userId) {
      const offer = await webRTCRef.current.createOffer(newUserId);
      socket.emit('offer', { target: newUserId, offer });
    }
  };

  const handleUserLeft = (leftUserId) => {
    setParticipants(prev => prev.filter(p => p.id !== leftUserId));
    webRTCRef.current.peerConnections[leftUserId]?.close();
    delete webRTCRef.current.peerConnections[leftUserId];
  };

  const handleOffer = async ({ sender, offer }) => {
    const answer = await webRTCRef.current.handleOffer(sender, offer);
    socket.emit('answer', { target: sender, answer });
  };

  const handleAnswer = ({ sender, answer }) => {
    webRTCRef.current.handleAnswer(sender, answer);
  };

  const handleIceCandidate = ({ sender, candidate }) => {
    webRTCRef.current.handleIceCandidate(sender, candidate);
  };

  return (
    <div className="video-room">
      <div className="local-video">
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted
        />
        <div className="user-info">
          <Avatar size="small">{userId.charAt(0).toUpperCase()}</Avatar>
          <span>You ({isTeacher ? 'Teacher' : 'Student'})</span>
        </div>
      </div>
      
      <div className="remote-videos">
        {participants.map(participant => (
          <div key={participant.id} className="remote-video">
            <video
              ref={ref => videoRefs.current[participant.id] = ref}
              autoPlay
              playsInline
              onCanPlay={() => {
                if (videoRefs.current[participant.id]) {
                  videoRefs.current[participant.id].srcObject = participant.stream;
                }
              }}
            />
            <div className="user-info">
              <Avatar size="small">{participant.id.charAt(0).toUpperCase()}</Avatar>
              <span>{participant.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRoom; 