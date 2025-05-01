import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import Whiteboard from './Whiteboard';
import ParticipantList from './ParticipantList';
import Chat from './Chat';
import FileSharing from './FileSharing';
import RecordingControl from './RecordingControl';

const ClassroomLayout = () => {
  return (
    <Box sx={{ height: '100vh', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ParticipantList />
            <RecordingControl />
            <FileSharing />
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <Whiteboard />
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3}>
          <Chat />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClassroomLayout;