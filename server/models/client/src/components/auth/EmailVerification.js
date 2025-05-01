import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Refresh, CheckCircle } from '@mui/icons-material';

const EmailVerification = () => {
  const { t } = useTranslation();
  const { currentUser, verifyUserEmail } = useAuth();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    setStatus('loading');
    const { success, error } = await verifyUserEmail();
    if (success) {
      setStatus('success');
      setMessage(t('auth.verificationSent'));
    } else {
      setStatus('error');
      setMessage(error?.message || t('auth.errors.default'));
    }
  };

  useEffect(() => {
    if (currentUser?.emailVerified) {
      setStatus('verified');
    }
  }, [currentUser]);

  if (status === 'verified') {
    return (
      <Alert severity="success" icon={<CheckCircle />}>
        {t('auth.emailVerified')}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="warning">
        {t('auth.verifyEmailWarning')}
      </Alert>
      <Button
        variant="contained"
        onClick={handleVerify}
        disabled={status === 'loading'}
        startIcon={status === 'loading' ? <CircularProgress size={20} /> : <Refresh />}
        sx={{ mt: 2 }}
      >
        {t('auth.sendVerification')}
      </Button>
      {message && (
        <Alert severity={status === 'error' ? 'error' : 'success'} sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default EmailVerification; 