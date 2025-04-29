import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography, Paper } from '@mui/material';

function LanguageTest() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 2 }}>
      <Typography variant="h4" gutterBottom>
        {t('common.welcome')}
      </Typography>

      <Box sx={{ my: 2 }}>
        <Button
          variant={i18n.language === 'en' ? 'contained' : 'outlined'}
          onClick={() => changeLanguage('en')}
          sx={{ mr: 1 }}
        >
          English
        </Button>
        <Button
          variant={i18n.language === 'fr' ? 'contained' : 'outlined'}
          onClick={() => changeLanguage('fr')}
        >
          Français
        </Button>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('auth.login')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('auth.signup')}
        </Typography>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('classroom.title')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('classroom.join')}
        </Typography>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t('exercises.title')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('exercises.start')}
        </Typography>
      </Box>
    </Paper>
  );
}

export default LanguageTest; 