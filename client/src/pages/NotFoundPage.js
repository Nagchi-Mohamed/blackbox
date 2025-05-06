import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" gutterBottom>404</Typography>
      <Typography variant="h4" gutterBottom>{t('page_not_found')}</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        {t('page_not_found_message')}
      </Typography>
      <Button 
        variant="contained" 
        size="large"
        onClick={() => navigate('/')}
      >
        {t('return_home')}
      </Button>
    </Container>
  );
};

export default NotFoundPage;