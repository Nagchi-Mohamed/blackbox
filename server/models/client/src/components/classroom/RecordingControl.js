import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { FiberManualRecord, Stop } from '@mui/icons-material';
import { useClassroom } from './ClassroomProvider';

const RecordingControl = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleStartRecording = () => {
    setIsRecording(true);
    // Start recording timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    // Save recording logic would go here
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1
    }}>
      {isRecording ? (
        <>
          <Button
            variant="contained"
            color="error"
            startIcon={<Stop />}
            onClick={handleStopRecording}
          >
            Stop Recording
          </Button>
          <Typography variant="body1">
            {formatTime(recordingTime)}
          </Typography>
          <CircularProgress size={24} color="error" />
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiberManualRecord />}
          onClick={handleStartRecording}
        >
          Start Recording
        </Button>
      )}
    </Box>
  );
};

export default RecordingControl;