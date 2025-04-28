import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Paper, Box, Tabs, Tab, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import SocialButtons from '../components/auth/SocialButtons';
import PasswordReset from '../components/auth/PasswordReset';

const AuthPage = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('auth.welcome')}
        </Typography>
        {!showReset ? (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label={t('auth.login')} />
                <Tab label={t('auth.signUp')} />
              </Tabs>
            </Box>
            {tabValue === 0 ? (
              <>
                <LoginForm 
                  onSwitchToSignup={() => setTabValue(1)}
                  onForgotPassword={() => setShowReset(true)}
                />
                <SocialButtons onError={setError} />
              </>
            ) : (
              <>
                <SignupForm onSwitchToLogin={() => setTabValue(0)} />
                <SocialButtons onError={setError} />
              </>
            )}
          </>
        ) : (
          <PasswordReset 
            onBackToLogin={() => {
              setShowReset(false);
              setTabValue(0);
            }}
          />
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage; 