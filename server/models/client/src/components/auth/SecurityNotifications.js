import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

const SecurityNotifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    newDevice: true,
    failedLogin: true,
    passwordChange: true,
    twoFactorChange: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadNotificationPreferences = async () => {
      try {
        setLoading(true);
        setError(null);
        // Add your API call here to load notification preferences
        const savedPreferences = localStorage.getItem('notificationPreferences');
        if (savedPreferences) {
          setNotifications(JSON.parse(savedPreferences));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNotificationPreferences();
  }, []);

  const handleToggle = async (key) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const newNotifications = {
        ...notifications,
        [key]: !notifications[key]
      };
      
      // Add your API call here to update notification preferences
      localStorage.setItem('notificationPreferences', JSON.stringify(newNotifications));
      setNotifications(newNotifications);
      setSuccess(t('common.saved'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('security.notifications.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('security.notifications.description')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box>
        <FormControlLabel
          control={
            <Switch
              checked={notifications.newDevice}
              onChange={() => handleToggle('newDevice')}
              disabled={loading}
            />
          }
          label={t('security.notifications.newDevice')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.failedLogin}
              onChange={() => handleToggle('failedLogin')}
              disabled={loading}
            />
          }
          label={t('security.notifications.loginAttempt')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.passwordChange}
              onChange={() => handleToggle('passwordChange')}
              disabled={loading}
            />
          }
          label={t('security.notifications.passwordChange')}
        />
        <FormControlLabel
          control={
            <Switch
              checked={notifications.twoFactorChange}
              onChange={() => handleToggle('twoFactorChange')}
              disabled={loading}
            />
          }
          label={t('security.notifications.twoFactorChange')}
        />
      </Box>
    </Paper>
  );
};

export default SecurityNotifications; 