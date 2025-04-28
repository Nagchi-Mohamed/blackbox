import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const AccountRecovery = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [recoveryEmail, setRecoveryEmail] = useState(currentUser?.email || '');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // In a real app, you would update this in your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(t('security.recovery.emailUpdated'));
      setEditingEmail(false);
    } catch (err) {
      setError(t('errors.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // In a real app, you would update this in your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(t('security.recovery.phoneUpdated'));
      setEditingPhone(false);
    } catch (err) {
      setError(t('errors.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('security.recovery.title')}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {t('security.recovery.description')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <List>
        <ListItem>
          <ListItemText
            primary={t('security.recovery.email')}
            secondary={editingEmail ? (
              <TextField
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                fullWidth
                size="small"
                type="email"
              />
            ) : (
              recoveryEmail || t('security.recovery.notSet')
            )}
          />
          <ListItemSecondaryAction>
            {editingEmail ? (
              <IconButton 
                edge="end" 
                onClick={handleSaveEmail}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <CheckIcon />}
              </IconButton>
            ) : (
              <IconButton 
                edge="end" 
                onClick={() => setEditingEmail(true)}
              >
                <EditIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
        
        <Divider component="li" />
        
        <ListItem>
          <ListItemText
            primary={t('security.recovery.phone')}
            secondary={editingPhone ? (
              <TextField
                value={recoveryPhone}
                onChange={(e) => setRecoveryPhone(e.target.value)}
                fullWidth
                size="small"
                type="tel"
                placeholder="+1 123 456 7890"
              />
            ) : (
              recoveryPhone || t('security.recovery.notSet')
            )}
          />
          <ListItemSecondaryAction>
            {editingPhone ? (
              <IconButton 
                edge="end" 
                onClick={handleSavePhone}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <CheckIcon />}
              </IconButton>
            ) : (
              <IconButton 
                edge="end" 
                onClick={() => setEditingPhone(true)}
              >
                <EditIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Paper>
  );
};

export default AccountRecovery; 