import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { InsertDriveFile, CloudUpload } from '@mui/icons-material';
import { useClassroom } from './ClassroomProvider';

const FileSharing = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      file
    }));
    setFiles(prev => [...prev, ...newFiles]);
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(null);
      }
    }, 200);
  };

  return (
    <Paper sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2
    }}>
      <Typography variant="h6" gutterBottom>
        Shared Files
      </Typography>
      <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
        <List>
          {files.map((file) => (
            <ListItem key={file.id}>
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={file.size}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box>
        <input
          accept="*/*"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            fullWidth
          >
            Upload Files
          </Button>
        </label>
        {uploadProgress && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <Typography variant="caption">
              Uploading: {uploadProgress}%
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FileSharing;