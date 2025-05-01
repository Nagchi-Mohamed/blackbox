import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Box, Typography, Link } from '@mui/material';

const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
  const { t } = useTranslation();
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(t(`auth.errors.${err.code}`) || t('auth.errors.default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label={t('auth.email')}
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label={t('auth.password')}
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {t('auth.login')}
      </Button>
      <Button
        fullWidth
        variant="text"
        onClick={onForgotPassword}
        sx={{ mt: 1 }}
      >
        {t('auth.forgotPassword')}
      </Button>
      <Typography align="center">
        {t('auth.noAccount')}{' '}
        <Link component="button" onClick={onSwitchToSignup}>
          {t('auth.signUp')}
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm; 