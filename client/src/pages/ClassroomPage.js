import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ClassroomService from '../services/ClassroomService';

const ClassroomPage = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomSection, setNewClassroomSection] = useState('');
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [joinClassroomId, setJoinClassroomId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await ClassroomService.getAllClassrooms();
      setClassrooms(response.data);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleCreateClassroom = async () => {
    try {
      const response = await ClassroomService.createClassroom({
        name: newClassroomName,
        section: newClassroomSection,
      });
      setOpenCreateDialog(false);
      setNewClassroomName('');
      setNewClassroomSection('');
      // Navigate to the newly created classroom page
      navigate("/classrooms/" + response.data._id);
    } catch (error) {
      console.error('Failed to create classroom:', error);
    }
  };

  const handleJoinClassroom = async () => {
    try {
      const response = await ClassroomService.joinClassroom(joinClassroomId);
      setOpenJoinDialog(false);
      setJoinClassroomId('');
      // Navigate to the joined classroom page
      navigate("/classrooms/" + response.data._id);
    } catch (error) {
      console.error('Failed to join classroom:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <Button 
            variant="contained" 
            onClick={() => setOpenCreateDialog(true)}
            style={{ textTransform: 'none', marginRight: '8px' }}
          >
            Create Classroom
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setOpenJoinDialog(true)}
            style={{ textTransform: 'none' }}
          >
            Join Classroom
          </Button>
        </div>
      </div>

      <Grid container spacing={3}>
        {loading ? (
          <Typography>Loading classrooms...</Typography>
        ) : classrooms.length === 0 ? (
          <Typography>No classrooms found.</Typography>
        ) : (
          classrooms.map((classroom) => (
            <Grid item xs={12} sm={6} md={4} key={classroom._id}>
              <Card 
                onClick={() => navigate("/classrooms/" + classroom._id)}
                style={{ 
                  borderLeft: "6px solid #4285f4",
                  height: '150px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    style={{ fontFamily: "'Google Sans Text', sans-serif" }}
                  >
                    {classroom.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    style={{ marginTop: '8px' }}
                  >
                    {classroom.section}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create Classroom</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Classroom Name"
            fullWidth
            variant="outlined"
            value={newClassroomName}
            onChange={(e) => setNewClassroomName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Section"
            fullWidth
            variant="outlined"
            value={newClassroomSection}
            onChange={(e) => setNewClassroomSection(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateClassroom} variant="contained" disabled={!newClassroomName || !newClassroomSection}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)}>
        <DialogTitle>Join Classroom</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Classroom ID"
            fullWidth
            variant="outlined"
            value={joinClassroomId}
            onChange={(e) => setJoinClassroomId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinClassroom} variant="contained" disabled={!joinClassroomId}>
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClassroomPage;
