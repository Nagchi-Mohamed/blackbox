
import { useState, useEffect } from 'react';
import { Box, Typography, Switch, FormControlLabel, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const Settings = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#121212' : '#ffffff';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSave = () => {
    // Save settings logic would go here
    console.log('Settings saved');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          }
          label="Dark Mode"
        />
        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
          }
          label="Enable Notifications"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Typography variant="body1">
          Email: {currentUser?.email}
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={handleSave}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default Settings;