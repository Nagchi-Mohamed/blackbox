import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Divider
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Share,
  StopScreenShare,
  Send
} from '@mui/icons-material';

const VirtualClassroom = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          videoElement.srcObject = stream;
        })
        .catch(err => {
          console.error('Error accessing media devices:', err);
        });
    }

    return () => {
      if (videoElement && videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
      }
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
      }
    }
  };

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
      } else {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { text: message, sender: 'You' }]);
      setMessage('');
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: '100vh', p: 2 }}>
      <Grid item xs={12} md={9}>
        <Paper sx={{ height: '100%', position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <IconButton onClick={handleToggleMute} color="primary">
              {isMuted ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton onClick={handleToggleVideo} color="primary">
              {isVideoOff ? <VideocamOff /> : <Videocam />}
            </IconButton>
            <IconButton onClick={handleToggleScreenShare} color="primary">
              {isScreenSharing ? <StopScreenShare /> : <Share />}
            </IconButton>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={3}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Chat</Typography>
          </Box>
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {chatMessages.map((msg, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>{msg.sender[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={msg.sender}
                  secondary={msg.text}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton onClick={handleSendMessage} color="primary">
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VirtualClassroom; 