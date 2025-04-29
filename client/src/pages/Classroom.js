import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Whiteboard from '../components/classroom/Whiteboard';
import MessageSystem from '../features/social/MessageSystem';
import { useAuth } from '../contexts/AuthContext';

const Classroom = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinClass = () => {
    setIsJoined(true);
  };

  const handleLeaveClass = () => {
    setIsJoined(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('classroom.title')}
      </Typography>

      {!isJoined ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            {t('classroom.joinPrompt')}
          </Typography>
          <button onClick={handleJoinClass}>
            {t('classroom.join')}
          </button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Whiteboard />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <MessageSystem currentUser={currentUser} />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Classroom; 