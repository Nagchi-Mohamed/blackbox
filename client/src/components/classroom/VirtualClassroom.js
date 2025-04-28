import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Grid, IconButton, Paper, Typography, Tooltip } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, ScreenShare, StopScreenShare, PresentToAll, Chat, People, Settings } from '@mui/icons-material';

const VirtualClassroom = ({ roomId }) => {
  const { t } = useTranslation();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const videoRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    // Initialize media devices
    const initDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    initDevices();

    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleAudio = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = videoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = videoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!screenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        if (screenRef.current) {
          screenRef.current.srcObject = screenStream;
        }
        setScreenSharing(true);
        
        // Handle when user stops screen sharing from browser controls
        screenStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
        };
      } else {
        if (screenRef.current && screenRef.current.srcObject) {
          screenRef.current.srcObject.getTracks().forEach(track => track.stop());
          screenRef.current.srcObject = null;
        }
        setScreenSharing(false);
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
        {t('Classroom')}: {roomId}
      </Typography>
      
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Main Content Area */}
        <Grid item xs={12} md={9} sx={{ p: 2 }}>
          <Paper sx={{ height: '100%', position: 'relative', backgroundColor: '#f5f5f5' }}>
            {screenSharing ? (
              <video
                ref={screenRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            
            {/* User video thumbnail */}
            {screenSharing && (
              <Box sx={{ position: 'absolute', bottom: 16, right: 16, width: '20%', minWidth: 150 }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={3} sx={{ p: 2, borderLeft: '1px solid #ddd' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Participants */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <People sx={{ verticalAlign: 'middle', mr: 1 }} />
                {t('Participants')} (4)
              </Typography>
              {/* List of participants would go here */}
            </Paper>
            
            {/* Chat */}
            <Paper sx={{ p: 2, flexGrow: 1, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                <Chat sx={{ verticalAlign: 'middle', mr: 1 }} />
                {t('Chat')}
              </Typography>
              {/* Chat messages would go here */}
            </Paper>
          </Box>
        </Grid>
      </Grid>
      
      {/* Controls */}
      <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'center' }}>
        <Tooltip title={audioEnabled ? t('Mute') : t('Unmute')}>
          <IconButton
            color={audioEnabled ? 'primary' : 'default'}
            onClick={toggleAudio}
            sx={{ mx: 1 }}
          >
            {audioEnabled ? <Mic /> : <MicOff />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={videoEnabled ? t('Stop Video') : t('Start Video')}>
          <IconButton
            color={videoEnabled ? 'primary' : 'default'}
            onClick={toggleVideo}
            sx={{ mx: 1 }}
          >
            {videoEnabled ? <Videocam /> : <VideocamOff />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={screenSharing ? t('Stop Sharing') : t('Share Screen')}>
          <IconButton
            color={screenSharing ? 'primary' : 'default'}
            onClick={toggleScreenShare}
            sx={{ mx: 1 }}
          >
            {screenSharing ? <StopScreenShare /> : <ScreenShare />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={t('Whiteboard')}>
          <IconButton
            color={whiteboardOpen ? 'primary' : 'default'}
            onClick={() => setWhiteboardOpen(!whiteboardOpen)}
            sx={{ mx: 1 }}
          >
            <PresentToAll />
          </IconButton>
        </Tooltip>
        
        <Button variant="contained" color="error" sx={{ ml: 2 }}>
          {t('Leave')}
        </Button>
      </Box>
    </Box>
  );
};

export default VirtualClassroom; 