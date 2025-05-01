import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

const AccountRecovery = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [recoveryEmail, setRecoveryEmail] = useState(currentUser?.email || '');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEmailUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      // Add your API call here to update recovery email
      setSuccess(t('security.recovery.emailUpdated'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      // Add your API call here to update recovery phone
      setSuccess(t('security.recovery.phoneUpdated'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('security.recovery.title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('security.recovery.description')}
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

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('security.recovery.email')}
        </Typography>
        <TextField
          fullWidth
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleEmailUpdate}
          disabled={loading || !recoveryEmail}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : t('common.update')}
        </Button>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          {t('security.recovery.phone')}
        </Typography>
        <TextField
          fullWidth
          value={recoveryPhone}
          onChange={(e) => setRecoveryPhone(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handlePhoneUpdate}
          disabled={loading || !recoveryPhone}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : t('common.update')}
        </Button>
      </Box>
    </Paper>
  );
};

export default AccountRecovery; 