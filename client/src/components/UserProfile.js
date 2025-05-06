import { Avatar, Box, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
          {currentUser?.username?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h5">{currentUser?.username}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {currentUser?.email}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Typography variant="body1">
          Role: {currentUser?.role}
        </Typography>
        <Typography variant="body1">
          Member since: {new Date(currentUser?.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Button 
        variant="contained" 
        color="error"
        onClick={logout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default UserProfile;