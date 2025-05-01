import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Computer as DesktopIcon,
  Phone as MobileIcon,
  Tablet as TabletIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const SessionManagement = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showLogoutAllDialog, setShowLogoutAllDialog] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Add your API call here to fetch sessions
      const mockSessions = [
        {
          id: 1,
          device: 'Desktop (Chrome)',
          location: 'New York, US',
          lastActive: new Date(),
          current: true
        },
        {
          id: 2,
          device: 'Mobile (Safari)',
          location: 'London, UK',
          lastActive: new Date(Date.now() - 86400000),
          current: false
        }
      ];
      setSessions(mockSessions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleLogout = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      // Add your API call here to logout session
      setSessions(sessions.filter(session => session.id !== sessionId));
      setShowLogoutDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      setLoading(true);
      setError(null);
      // Add your API call here to logout all sessions
      setSessions(sessions.filter(session => session.current));
      setShowLogoutAllDialog(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (device) => {
    if (device.toLowerCase().includes('mobile')) {
      return <MobileIcon />;
    } else if (device.toLowerCase().includes('tablet')) {
      return <TabletIcon />;
    }
    return <DesktopIcon />;
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
        {t('security.sessions.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {sessions.map((session) => (
          <ListItem key={session.id}>
            <Box display="flex" alignItems="center" gap={1}>
              {getDeviceIcon(session.device)}
              <ListItemText
                primary={session.device}
                secondary={`${session.location} • ${new Date(session.lastActive).toLocaleString()}`}
              />
            </Box>
            <ListItemSecondaryAction>
              {!session.current && (
                <IconButton
                  edge="end"
                  onClick={() => {
                    setSelectedSession(session);
                    setShowLogoutDialog(true);
                  }}
                  disabled={loading}
                >
                  <LogoutIcon />
                </IconButton>
              )}
              {session.current && (
                <Typography variant="caption" color="text.secondary">
                  {t('security.sessions.current')}
                </Typography>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {sessions.length > 1 && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => setShowLogoutAllDialog(true)}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {t('security.sessions.logoutAll')}
        </Button>
      )}

      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      >
        <DialogTitle>{t('security.sessions.confirmLogout')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('security.sessions.logoutWarning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => handleLogout(selectedSession?.id)}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showLogoutAllDialog}
        onClose={() => setShowLogoutAllDialog(false)}
      >
        <DialogTitle>{t('security.sessions.confirmLogoutAll')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('security.sessions.logoutAllWarning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutAllDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleLogoutAll}
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SessionManagement; 