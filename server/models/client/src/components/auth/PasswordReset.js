import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

const PasswordReset = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendPasswordReset(email);
      setMessage(t('auth.resetPasswordSuccess'));
    } catch (err) {
      setError(t(`auth.errors.${err.code}`) || t('auth.errors.default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="body1" gutterBottom>
        {t('auth.resetPasswordInstructions')}
      </Typography>
      <TextField
        label={t('auth.email')}
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {t('auth.resetPassword')}
      </Button>
      <Button
        fullWidth
        variant="text"
        onClick={onBackToLogin}
        disabled={loading}
      >
        {t('auth.backToLogin')}
      </Button>
    </Box>
  );
};

export default PasswordReset; 