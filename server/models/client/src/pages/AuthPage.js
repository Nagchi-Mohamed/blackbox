import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {t('common.welcome')}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          {t('common.description')}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
          >
            <Tab label={t('auth.login')} />
            <Tab label={t('auth.signup')} />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}
      </Paper>
    </Container>
  );
};

export default AuthPage; 