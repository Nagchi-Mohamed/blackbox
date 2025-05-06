import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  MoreVert,
  ClassOutlined,
  PeopleAltOutlined,
  ExitToAppOutlined,
  CommentOutlined,
  AssignmentOutlined,
  StreamOutlined,
} from '@mui/icons-material';
import axios from 'axios';

const ClassroomDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const [classroom, setClassroom] = useState(null);
  const [posts, setPosts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  // Dialog states
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openTopicDialog, setOpenTopicDialog] = useState(false);

  // New post form state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState('announcement');

  // New assignment form state
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

  // New topic form state
  const [newTopicName, setNewTopicName] = useState('');

  // Menu state for posts
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      const [classroomRes, postsRes, assignmentsRes] = await Promise.all([
        axios.get(`/api/classrooms/${id}`),
        axios.get(`/api/classrooms/${id}/posts`),
        axios.get(`/api/classrooms/${id}/assignments`),
      ]);
      setClassroom(classroomRes.data);
      setPosts(postsRes.data);
      setAssignments(assignmentsRes.data);
      setStudents(classroomRes.data.students || []);
      setTeachers([classroomRes.data.teacher]);
    } catch (error) {
      console.error('Failed to fetch classroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomData();
  }, [id]);

  const handleCreatePost = async () => {
    try {
      await axios.post(`/api/classrooms/${id}/posts`, {
        type: newPostType,
        title: newPostTitle,
        content: newPostContent,
      });
      setOpenPostDialog(false);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostType('announcement');
      fetchClassroomData();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await axios.post(`/api/classrooms/${id}/assignments`, {
        title: newAssignmentTitle,
        description: newAssignmentDescription,
        dueDate: newAssignmentDueDate,
      });
      setOpenAssignmentDialog(false);
      setNewAssignmentTitle('');
      setNewAssignmentDescription('');
      setNewAssignmentDueDate('');
      fetchClassroomData();
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
  };

  const handleCreateTopic = () => {
    // Placeholder for topic creation logic
    setOpenTopicDialog(false);
    setNewTopicName('');
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!classroom) {
    return <Typography>{t('classroom.not_found')}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', fontFamily: "'Google Sans Text', sans-serif" }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, bgcolor: '#f1f3f4', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {classroom.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368' }}>
            Class Code: {classroom._id}
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setOpenPostDialog(true)}>
            Create Post
          </Button>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setOpenAssignmentDialog(true)}>
            Create Assignment
          </Button>
          <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setOpenTopicDialog(true)}>
            Create Topic
          </Button>
        </Box>
        <Tabs
          orientation="vertical"
          value={tabIndex}
          onChange={handleTabChange}
          sx={{ flexGrow: 1 }}
          aria-label="Classroom navigation tabs"
        >
          <Tab icon={<StreamOutlined />} label="Stream" />
          <Tab icon={<AssignmentOutlined />} label="Classwork" />
          <Tab icon={<PeopleAltOutlined />} label="People" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {tabIndex === 0 && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Stream
            </Typography>
            {posts.length === 0 ? (
              <Typography>No posts available.</Typography>
            ) : (
              posts.map((post) => (
                <Card key={post._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">{post.title}</Typography>
                      <IconButton onClick={(e) => handleMenuOpen(e, post._id)}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedPostId === post._id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                      </Menu>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {post.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted by {post.author?.name || post.author?.email}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {tabIndex === 1 && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Classwork
            </Typography>
            {assignments.length === 0 ? (
              <Typography>No assignments available.</Typography>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{assignment.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {assignment.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due Date: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {tabIndex === 2 && (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              People
            </Typography>
            <Typography variant="h6">Teachers</Typography>
            <List>
              {teachers.map((teacher) => (
                <ListItem key={teacher._id}>
                  <Avatar sx={{ mr: 2 }}>{teacher.name ? teacher.name.charAt(0) : teacher.email.charAt(0)}</Avatar>
                  <ListItemText primary={teacher.name || teacher.email} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Students
            </Typography>
            <List>
              {students.map((student) => (
                <ListItem key={student._id}>
                  <Avatar sx={{ mr: 2 }}>{student.name ? student.name.charAt(0) : student.email.charAt(0)}</Avatar>
                  <ListItemText primary={student.name || student.email} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      {/* Create Post Dialog */}
      <Dialog open={openPostDialog} onClose={() => setOpenPostDialog(false)}>
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            variant="outlined"
            value={newPostType}
            onChange={(e) => setNewPostType(e.target.value)}
            helperText="e.g. announcement, question"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPostDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)}>
        <DialogTitle>Create Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newAssignmentTitle}
            onChange={(e) => setNewAssignmentTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newAssignmentDescription}
            onChange={(e) => setNewAssignmentDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newAssignmentDueDate}
            onChange={(e) => setNewAssignmentDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignmentDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAssignment} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Topic Dialog */}
      <Dialog open={openTopicDialog} onClose={() => setOpenTopicDialog(false)}>
        <DialogTitle>Create Topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Topic Name"
            fullWidth
            variant="outlined"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTopicDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTopic} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassroomDetailPage;
