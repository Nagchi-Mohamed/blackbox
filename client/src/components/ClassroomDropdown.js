import React, { useState, useEffect } from 'react';
import { Menu, MenuItem, Button, Divider, ListItemIcon, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Add, GroupAdd, ClassOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClassroomDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [joinClassCode, setJoinClassCode] = useState('');
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/classrooms');
      setClassrooms(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load classrooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchClassrooms();
    }
  }, [open]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateClass = async () => {
    if (newClassName.trim()) {
      try {
        const response = await axios.post('/api/classrooms', { name: newClassName, section: 'New Section' });
        setClassrooms(prev => [...prev, response.data]);
        setOpenCreate(false);
        setNewClassName('');
      } catch (err) {
        alert('Failed to create classroom');
      }
    }
  };

  const handleJoinClass = async () => {
    if (joinClassCode.trim()) {
      try {
        await axios.post(\`/api/classrooms/\${joinClassCode}/join\`);
        fetchClassrooms();
        setOpenJoin(false);
        setJoinClassCode('');
      } catch (err) {
        alert('Failed to join classroom');
      }
    }
  };

  const handleNavigate = (id) => {
    navigate(\`/classrooms/\${id}\`);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        startIcon={<ClassOutlined />}
      >
        Classrooms
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 300, width: '25ch' } }}
      >
        {loading && (
          <MenuItem>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>Loading...</Typography>
          </MenuItem>
        )}
        {error && (
          <MenuItem disabled>
            <Typography variant="body2" color="error">{error}</Typography>
          </MenuItem>
        )}
        {!loading && !error && classrooms.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2">No classrooms found</Typography>
          </MenuItem>
        )}
        {!loading && !error && classrooms.map((cls) => (
          <MenuItem key={cls._id} onClick={() => handleNavigate(cls._id)}>
            {cls.name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { setOpenCreate(true); handleClose(); }}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          Create Classroom
        </MenuItem>
        <MenuItem onClick={() => { setOpenJoin(true); handleClose(); }}>
          <ListItemIcon>
            <GroupAdd fontSize="small" />
          </ListItemIcon>
          Join Classroom
        </MenuItem>
      </Menu>

      {/* Create Classroom Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New Classroom</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Classroom Name"
            fullWidth
            variant="outlined"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreateClass} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Join Classroom Dialog */}
      <Dialog open={openJoin} onClose={() => setOpenJoin(false)}>
        <DialogTitle>Join Classroom</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Classroom Code"
            fullWidth
            variant="outlined"
            value={joinClassCode}
            onChange={(e) => setJoinClassCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoin(false)}>Cancel</Button>
          <Button onClick={handleJoinClass} variant="contained">Join</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClassroomDropdown;
