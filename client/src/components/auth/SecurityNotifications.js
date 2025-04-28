import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const SecurityNotifications = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState({
    newDevice: true,
    loginAttempt: true,
    passwordChange: true,
    twoFactorChange: true
  });

  // Load saved preferences
  useEffect(() => {
    // In a real app, you would fetch these from your backend
    const savedPrefs = JSON.parse(localStorage.getItem('notificationPrefs')) || {};
    setNotifications(prev => ({ ...prev, ...savedPrefs }));
  }, []);

  const handleToggle = (type) => {
    const newPrefs = { ...notifications, [type]: !notifications[type] };
    setNotifications(newPrefs);
    localStorage.setItem('notificationPrefs', JSON.stringify(newPrefs));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <NotificationsActiveIcon sx={{ mr: 2 }} />
        <Typography variant="h6">
          {t('security.notifications.title')}
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        {t('security.notifications.description')}
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={notifications.newDevice}
              onChange={() => handleToggle('newDevice')}
            />
          }
          label={t('security.notifications.newDevice')}
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.loginAttempt}
              onChange={() => handleToggle('loginAttempt')}
            />
          }
          label={t('security.notifications.loginAttempt')}
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.passwordChange}
              onChange={() => handleToggle('passwordChange')}
            />
          }
          label={t('security.notifications.passwordChange')}
        />
        <Divider />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.twoFactorChange}
              onChange={() => handleToggle('twoFactorChange')}
            />
          }
          label={t('security.notifications.twoFactorChange')}
        />
      </Box>
    </Paper>
  );
};

export default SecurityNotifications; 