import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Chip,
  Divider
} from '@mui/material';
import {
  Computer,
  Phone,
  Tablet,
  Public,
  AccessTime,
  Logout,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SessionManagement = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    sessionId: null,
    action: null
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // In a real app, this would be an API call to your backend
      const mockSessions = [
        {
          id: '1',
          device: 'Chrome on Windows',
          location: 'New York, USA',
          lastActive: new Date(),
          isCurrent: true,
          type: 'desktop'
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          location: 'London, UK',
          lastActive: new Date(Date.now() - 3600000),
          isCurrent: false,
          type: 'mobile'
        }
      ];
      setSessions(mockSessions);
    } catch (err) {
      setError(t('security.sessions.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    setConfirmDialog({
      open: true,
      sessionId,
      action: 'logout'
    });
  };

  const handleLogoutAll = () => {
    setConfirmDialog({
      open: true,
      sessionId: null,
      action: 'logoutAll'
    });
  };

  const confirmAction = async () => {
    try {
      if (confirmDialog.action === 'logoutAll') {
        await logout();
      } else {
        // In a real app, this would be an API call to your backend
        setSessions(sessions.filter(s => s.id !== confirmDialog.sessionId));
      }
    } catch (err) {
      setError(t('security.sessions.actionError'));
    } finally {
      setConfirmDialog({ open: false, sessionId: null, action: null });
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'desktop':
        return <Computer />;
      case 'mobile':
        return <Phone />;
      case 'tablet':
        return <Tablet />;
      default:
        return <Computer />;
    }
  };

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
          <React.Fragment key={session.id}>
            <ListItem
              secondaryAction={
                !session.isCurrent && (
                  <IconButton
                    edge="end"
                    onClick={() => handleLogoutSession(session.id)}
                  >
                    <Logout />
                  </IconButton>
                )
              }
            >
              <ListItemIcon>
                {getDeviceIcon(session.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    {session.device}
                    {session.isCurrent && (
                      <Chip
                        label={t('security.sessions.current')}
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Public fontSize="small" />
                      {session.location}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" />
                      {new Date(session.lastActive).toLocaleString()}
                    </Box>
                  </>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogoutAll}
          startIcon={<Warning />}
        >
          {t('security.sessions.logoutAll')}
        </Button>
      </Box>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, sessionId: null, action: null })}
      >
        <DialogTitle>
          {confirmDialog.action === 'logoutAll'
            ? t('security.sessions.confirmLogoutAll')
            : t('security.sessions.confirmLogout')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'logoutAll'
              ? t('security.sessions.logoutAllWarning')
              : t('security.sessions.logoutWarning')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, sessionId: null, action: null })}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={confirmAction}
            color="error"
            variant="contained"
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SessionManagement; 