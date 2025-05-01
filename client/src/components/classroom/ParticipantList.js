import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useClassroom } from './ClassroomProvider';

const ParticipantList = () => {
  const { participants } = useClassroom();

  return (
    <List sx={{ 
      width: '100%',
      maxHeight: 300,
      overflow: 'auto',
      bgcolor: 'background.paper'
    }}>
      {participants.map((participant, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>
              {participant.name.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={participant.name}
            secondary={
              <Typography variant="body2" color="text.secondary">
                {participant.role} • {participant.status}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ParticipantList;