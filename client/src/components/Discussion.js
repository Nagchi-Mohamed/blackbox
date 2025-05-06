import { useState } from 'react';
import { Avatar, Box, Typography, TextField, Button } from '@mui/material';
import { format } from 'date-fns';

const Discussion = ({ discussion }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(discussion.comments || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: 'Current User',
      content: comment,
      createdAt: new Date()
    };
    
    setComments([...comments, newComment]);
    setComment('');
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {discussion.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {discussion.content}
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment..."
          />
          <Button type="submit" variant="contained" sx={{ mt: 1 }}>
            Post Comment
          </Button>
        </Box>

        {comments.map((c) => (
          <Box key={c.id} sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Avatar>{c.author.charAt(0)}</Avatar>
            <Box>
              <Typography variant="subtitle2">
                {c.author} • {format(new Date(c.createdAt), 'MMM d, yyyy')}
              </Typography>
              <Typography variant="body1">{c.content}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Discussion;