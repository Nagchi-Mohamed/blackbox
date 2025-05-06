import React from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Whiteboard from './Whiteboard';
import ParticipantList from './ParticipantList';
import Chat from './Chat';
import FileSharing from './FileSharing';
import RecordingControl from './RecordingControl';

function ClassroomLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { label: 'Stream', path: 'stream' },
    { label: 'Classwork', path: 'classwork' },
    { label: 'People', path: 'people' },
    { label: 'Grades', path: 'grades' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Paper elevation={3} sx={{ mb: 2 }}>
        <Tabs 
          value={tabs.findIndex(tab => location.pathname.includes(tab.path))}
          onChange={(e, newValue) => navigate(tabs[newValue].path)}
        >
          {tabs.map(tab => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      
      <Outlet /> {/* This will render nested routes */}
    </Box>
  );
}

export default ClassroomLayout;