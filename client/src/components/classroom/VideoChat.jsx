import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { VideoCameraOutlined, AudioOutlined, StopOutlined } from '@ant-design/icons';
import { socket } from '../../services/socketService';
import './VideoChat.less';

const VideoChat = ({ classroomId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const localVideoRef = useRef(null);
  const peerConnections = useRef({});

  useEffect(() => {
    // Set up socket listeners for WebRTC signaling
    socket.on('offer', async (data) => {
      const { from, offer } = data;
      const pc = createPeerConnection(from);
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socket.emit('answer', { 
        to: from, 
        answer,
        classroomId 
      });
    });

    socket.on('answer', async (data) => {
      const { from, answer } = data;
      const pc = peerConnections.current[from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', (data) => {
      const { from, candidate } = data;
      const pc = peerConnections.current[from];
      if (pc && candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('new-peer', ({ peerId }) => {
      if (localStream) {
        initiatePeerConnection(peerId);
      }
    });

    socket.on('peer-disconnected', ({ peerId }) => {
      if (peerConnections.current[peerId]) {
        peerConnections.current[peerId].close();
        delete peerConnections.current[peerId];
        setRemoteStreams(prev => prev.filter(stream => stream.peerId !== peerId));
      }
    });

    return () => {
      Object.values(peerConnections.current).forEach(pc => pc.close());
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          to: peerId,
          candidate: event.candidate,
          classroomId
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams(prev => [...prev, {
        peerId,
        stream: event.streams[0]
      }]);
    };

    if (localStream) {
      localStream.getTracks().forEach(track => 
        pc.addTrack(track, localStream)
      );
    }

    peerConnections.current[peerId] = pc;
    return pc;
  };

  const initiatePeerConnection = async (peerId) => {
    const pc = createPeerConnection(peerId);
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    socket.emit('offer', {
      to: peerId,
      offer,
      classroomId
    });
  };

  const toggleVideo = async () => {
    try {
      if (!isVideoOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
        setIsVideoOn(true);
        
        // Notify other participants
        socket.emit('media-change', {
          classroomId,
          video: true
        });
      } else {
        localStream.getVideoTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
        setLocalStream(null);
        setIsVideoOn(false);
      }
    } catch (error) {
      message.error('Failed to access camera: ' + error.message);
    }
  };

  const toggleAudio = async () => {
    try {
      if (!isAudioOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localStream) {
          localStream.addTrack(stream.getAudioTracks()[0]);
        } else {
          setLocalStream(stream);
        }
        setIsAudioOn(true);
      } else {
        localStream.getAudioTracks().forEach(track => track.stop());
        setIsAudioOn(false);
      }
    } catch (error) {
      message.error('Failed to access microphone: ' + error.message);
    }
  };

  return (
    <div className="video-chat">
      <div className="video-container">
        {isVideoOn && (
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            className="local-video"
          />
        )}
        {remoteStreams.map(({ peerId, stream }) => (
          <video
            key={peerId}
            autoPlay
            className="remote-video"
            ref={ref => {
              if (ref) ref.srcObject = stream;
            }}
          />
        ))}
      </div>
      <div className="controls">
        <Button
          icon={isVideoOn ? <StopOutlined /> : <VideoCameraOutlined />}
          onClick={toggleVideo}
          type={isVideoOn ? 'primary' : 'default'}
        >
          {isVideoOn ? 'Stop Video' : 'Start Video'}
        </Button>
        <Button
          icon={isAudioOn ? <StopOutlined /> : <AudioOutlined />}
          onClick={toggleAudio}
          type={isAudioOn ? 'primary' : 'default'}
        >
          {isAudioOn ? 'Mute' : 'Unmute'}
        </Button>
      </div>
    </div>
  );
};

export default VideoChat; 