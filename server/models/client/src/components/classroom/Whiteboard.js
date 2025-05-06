import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';

const Whiteboard = ({ roomId }) => {
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const client = useRef();
  const localTracks = useRef([]);
  const localPlayerContainer = useRef();

  useEffect(() => {
    try {
      client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      const joinRoom = async () => {
        try {
          await client.current.join(
            process.env.REACT_APP_AGORA_APP_ID,
            roomId,
            null,
            null
          );
        } catch (error) {
          console.error('Failed to join room:', error);
        }
      };

      joinRoom();

      return () => {
        client.current.leave();
        localTracks.current.forEach(track => {
          track.stop();
          track.close();
        });
      };
    } catch (error) {
      console.error('Agora initialization failed:', error);
    }
  }, [roomId]);

  const toggleAudio = async () => {
    if (hasAudio) {
      localTracks[0].setEnabled(false);
      setHasAudio(false);
    } else {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.current.publish(audioTrack);
      setLocalTracks([...localTracks, audioTrack]);
      setHasAudio(true);
    }
  };

  const toggleVideo = async () => {
    if (hasVideo) {
      localTracks[1].setEnabled(false);
      setHasVideo(false);
    } else {
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      await client.current.publish(videoTrack);
      videoTrack.play(localPlayerContainer.current);
      setLocalTracks([...localTracks, videoTrack]);
      setHasVideo(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Developer credit section */}
      <Box sx={{ 
        p: 1, 
        bgcolor: 'primary.main', 
        color: 'white',
        textAlign: 'right'
      }}>
        <Typography variant="caption">
          Developed by: {developerInfo.name} - {developerInfo.role}
        </Typography>
      </Box>
      
      <div ref={localPlayerContainer} style={{ width: '100%', height: '80%' }} />
      <Stack direction="row" spacing={2}>
        <IconButton onClick={toggleAudio}>
          {hasAudio ? <Mic /> : <MicOff />}
        </IconButton>
        <IconButton onClick={toggleVideo}>
          {hasVideo ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Whiteboard;