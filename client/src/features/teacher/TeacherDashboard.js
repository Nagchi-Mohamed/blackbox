import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const loadTeacherData = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Load classes
      const classesQuery = query(
        collection(db, 'classes'),
        where('teacherId', '==', currentUser.uid)
      );
      const classesSnapshot = await getDocs(classesQuery);
      const classesData = classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClasses(classesData);

      // Load students
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student')
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentsData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadTeacherData();
  }, [loadTeacherData]);

  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;

    try {
      await addDoc(collection(db, 'classes'), {
        name: newClassName,
        teacherId: currentUser.uid,
        createdAt: new Date(),
        students: []
      });

      setNewClassName('');
      setOpenClassDialog(false);
      loadTeacherData();
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteDoc(doc(db, 'classes', classId));
      loadTeacherData();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Classes Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{t('teacher.classes')}</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenClassDialog(true)}
              >
                {t('teacher.createClass')}
              </Button>
            </Box>
            <List>
              {classes.map((classItem) => (
                <ListItem key={classItem.id}>
                  <ListItemText
                    primary={classItem.name}
                    secondary={`${classItem.students?.length || 0} ${t('teacher.students')}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => setSelectedClass(classItem)}
                    >
                      <AssessmentIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteClass(classItem.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Student Progress Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('teacher.studentProgress')}
            </Typography>
            <List>
              {students.map((student) => (
                <ListItem key={student.id}>
                  <ListItemText
                    primary={student.displayName || student.email}
                    secondary={`${student.completedExercises || 0} ${t('teacher.completedExercises')}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <AssessmentIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Create Class Dialog */}
      <Dialog open={openClassDialog} onClose={() => setOpenClassDialog(false)}>
        <DialogTitle>{t('teacher.createClass')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('teacher.className')}
            fullWidth
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClassDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleCreateClass} variant="contained">
            {t('common.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard; 