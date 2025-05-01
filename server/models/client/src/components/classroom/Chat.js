import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { useClassroom } from './ClassroomProvider';

const Chat = () => {
  const { participants } = useClassroom();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <Paper sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2
    }}>
      <Typography variant="h6" gutterBottom>
        Classroom Chat
      </Typography>
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 1
      }}>
        <List>
          {messages.map((message) => (
            <ListItem key={message.id}>
              <ListItemText
                primary={`${message.sender}: ${message.text}`}
                secondary={message.timestamp}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          variant="contained" 
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;