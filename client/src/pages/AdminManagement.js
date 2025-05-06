import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Typography, TextField, Button, IconButton, Snackbar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import axios from 'axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);

  // Lessons state
  const [lessons, setLessons] = useState([]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState('');
  const [editingLessonContent, setEditingLessonContent] = useState('');

  // Exercises state
  const [exercises, setExercises] = useState([]);
  const [newExerciseTitle, setNewExerciseTitle] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editingExerciseTitle, setEditingExerciseTitle] = useState('');
  const [editingExerciseDescription, setEditingExerciseDescription] = useState('');

  // Users state
  const [users, setUsers] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState(null);
  const [confirmDialogData, setConfirmDialogData] = useState(null);

  useEffect(() => {
    fetchLessons();
    fetchExercises();
    fetchUsers();
  }, []);

  // Fetch lessons
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lessons');
      setLessons(res.data);
    } catch (err) {
      setError('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  // Fetch exercises (flattened from lessons)
  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lessons');
      // Flatten exercises with lessonId reference
      const allExercises = [];
      res.data.forEach(lesson => {
        lesson.exercises.forEach(exercise => {
          allExercises.push({ ...exercise, lessonId: lesson._id });
        });
      });
      setExercises(allExercises);
    } catch (err) {
      setError('Failed to fetch exercises');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Add lesson
  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !newLessonContent.trim()) {
      setSnackbarMessage('Please fill in all lesson fields');
      return;
    }
    try {
      const res = await axios.post('/api/lessons', {
        title: { en: newLessonTitle },
        content: { en: newLessonContent },
        exercises: []
      });
      setLessons([...lessons, res.data]);
      setNewLessonTitle('');
      setNewLessonContent('');
      setSnackbarMessage('Lesson added');
    } catch (err) {
      setSnackbarMessage('Failed to add lesson');
    }
  };

  // Edit lesson
  const startEditLesson = (lesson) => {
    setEditingLessonId(lesson._id);
    setEditingLessonTitle(lesson.title.en || '');
    setEditingLessonContent(lesson.content.en || '');
  };

  const cancelEditLesson = () => {
    setEditingLessonId(null);
    setEditingLessonTitle('');
    setEditingLessonContent('');
  };

  const saveEditLesson = async () => {
    if (!editingLessonTitle.trim() || !editingLessonContent.trim()) {
      setSnackbarMessage('Please fill in all lesson fields');
      return;
    }
    try {
      const res = await axios.put(`/api/lessons/${editingLessonId}`, {
        title: { en: editingLessonTitle },
        content: { en: editingLessonContent }
      });
      setLessons(lessons.map(l => (l._id === editingLessonId ? res.data : l)));
      cancelEditLesson();
      setSnackbarMessage('Lesson updated');
    } catch (err) {
      setSnackbarMessage('Failed to update lesson');
    }
  };

  // Delete lesson
  const confirmDeleteLesson = (lesson) => {
    setConfirmDialogAction(() => () => deleteLesson(lesson._id));
    setConfirmDialogData(lesson);
    setConfirmDialogOpen(true);
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`/api/lessons/${id}`);
      setLessons(lessons.filter(l => l._id !== id));
      setSnackbarMessage('Lesson deleted');
    } catch (err) {
      setSnackbarMessage('Failed to delete lesson');
    }
    setConfirmDialogOpen(false);
  };

  // Add exercise
  const handleAddExercise = async () => {
    if (!newExerciseTitle.trim() || !newExerciseDescription.trim()) {
      setSnackbarMessage('Please fill in all exercise fields');
      return;
    }
    try {
      // For simplicity, add exercise to first lesson (could be improved)
      if (lessons.length === 0) {
        setSnackbarMessage('Add a lesson first');
        return;
      }
      const lessonId = lessons[0]._id;
      const res = await axios.post(`/api/admin/lessons/${lessonId}/exercises`, {
        title: newExerciseTitle,
        description: newExerciseDescription
      });
      setExercises([...exercises, { ...res.data, lessonId }]);
      setNewExerciseTitle('');
      setNewExerciseDescription('');
      setSnackbarMessage('Exercise added');
    } catch (err) {
      setSnackbarMessage('Failed to add exercise');
    }
  };

  // Edit exercise
  const startEditExercise = (exercise) => {
    setEditingExerciseId(exercise._id);
    setEditingExerciseTitle(exercise.title || '');
    setEditingExerciseDescription(exercise.description || '');
  };

  const cancelEditExercise = () => {
    setEditingExerciseId(null);
    setEditingExerciseTitle('');
    setEditingExerciseDescription('');
  };

  const saveEditExercise = async () => {
    if (!editingExerciseTitle.trim() || !editingExerciseDescription.trim()) {
      setSnackbarMessage('Please fill in all exercise fields');
      return;
    }
    try {
      const exercise = exercises.find(e => e._id === editingExerciseId);
      const res = await axios.put(`/api/admin/lessons/${exercise.lessonId}/exercises/${editingExerciseId}`, {
        title: editingExerciseTitle,
        description: editingExerciseDescription
      });
      setExercises(exercises.map(e => (e._id === editingExerciseId ? res.data : e)));
      cancelEditExercise();
      setSnackbarMessage('Exercise updated');
    } catch (err) {
      setSnackbarMessage('Failed to update exercise');
    }
  };

  // Delete exercise
  const confirmDeleteExercise = (exercise) => {
    setConfirmDialogAction(() => () => deleteExercise(exercise));
    setConfirmDialogData(exercise);
    setConfirmDialogOpen(true);
  };

  const deleteExercise = async (exercise) => {
    try {
      await axios.delete(`/api/admin/lessons/${exercise.lessonId}/exercises/${exercise._id}`);
      setExercises(exercises.filter(e => e._id !== exercise._id));
      setSnackbarMessage('Exercise deleted');
    } catch (err) {
      setSnackbarMessage('Failed to delete exercise');
    }
    setConfirmDialogOpen(false);
  };

  // Delete user
  const confirmDeleteUser = (user) => {
    setConfirmDialogAction(() => () => deleteUser(user._id));
    setConfirmDialogData(user);
    setConfirmDialogOpen(true);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setSnackbarMessage('User deleted');
    } catch (err) {
      setSnackbarMessage('Failed to delete user');
    }
    setConfirmDialogOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarMessage('');
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <ProtectedRoute adminOnly>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Admin Management</Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="admin management tabs">
          <Tab label="Lessons" />
          <Tab label="Exercises" />
          <Tab label="Users" />
        </Tabs>

        <TabPanel value={tabIndex} index={0}>
          {loading ? <CircularProgress /> : (
            <>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="New Lesson Title"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="New Lesson Content"
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
                <Button variant="contained" onClick={handleAddLesson}>Add Lesson</Button>
              </Box>
              {lessons.map((lesson) => (
                <Box key={lesson._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  {editingLessonId === lesson._id ? (
                    <>
                      <TextField
                        label="Title"
                        value={editingLessonTitle}
                        onChange={(e) => setEditingLessonTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Content"
                        value={editingLessonContent}
                        onChange={(e) => setEditingLessonContent(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                      />
                      <IconButton onClick={saveEditLesson} aria-label="save">
                        <Save />
                      </IconButton>
                      <IconButton onClick={cancelEditLesson} aria-label="cancel">
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6">{lesson.title.en}</Typography>
                      <Typography>{lesson.content.en}</Typography>
                      <IconButton onClick={() => startEditLesson(lesson)} aria-label="edit">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => confirmDeleteLesson(lesson)} aria-label="delete">
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Box>
              ))}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          {loading ? <CircularProgress /> : (
            <>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="New Exercise Title"
                  value={newExerciseTitle}
                  onChange={(e) => setNewExerciseTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="New Exercise Description"
                  value={newExerciseDescription}
                  onChange={(e) => setNewExerciseDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Button variant="contained" onClick={handleAddExercise}>Add Exercise</Button>
              </Box>
              {exercises.map((exercise) => (
                <Box key={exercise._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                  {editingExerciseId === exercise._id ? (
                    <>
                      <TextField
                        label="Title"
                        value={editingExerciseTitle}
                        onChange={(e) => setEditingExerciseTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Description"
                        value={editingExerciseDescription}
                        onChange={(e) => setEditingExerciseDescription(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                      />
                      <IconButton onClick={saveEditExercise} aria-label="save">
                        <Save />
                      </IconButton>
                      <IconButton onClick={cancelEditExercise} aria-label="cancel">
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <Typography variant="h6">{exercise.title}</Typography>
                      <Typography>{exercise.description}</Typography>
                      <IconButton onClick={() => startEditExercise(exercise)} aria-label="edit">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => confirmDeleteExercise(exercise)} aria-label="delete">
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </Box>
              ))}
            </>
          )}
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {loading ? <CircularProgress /> : (
            <>
              {users.map((user) => (
                <Box key={user._id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>{user.username} ({user.email})</Typography>
                  <IconButton onClick={() => confirmDeleteUser(user)} aria-label="delete">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </>
          )}
        </TabPanel>

        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />

        <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this item?</Typography>
            {confirmDialogData && (
              <Typography sx={{ mt: 2 }}>
                {confirmDialogData.title?.en || confirmDialogData.title || confirmDialogData.username || ''}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
            <Button onClick={() => {
              if (confirmDialogAction) confirmDialogAction();
            }} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ProtectedRoute>
  );
};

export default AdminManagement;
