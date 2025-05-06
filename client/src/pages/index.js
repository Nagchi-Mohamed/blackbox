import React from 'react';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          mt: 12,
          mb: 12,
          background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(13, 71, 161, 0.15)',
          padding: 6,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}
        >
          {t('home_hero_headline')}
        </Typography>
        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          paragraph
          sx={{ mb: 5, fontSize: '1.3rem', lineHeight: 1.6 }}
        >
          Experience the future of math education with BrainyMath Pro — where innovation meets mastery, collaboration sparks creativity, and every learner unlocks their true potential.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/classrooms')}
            sx={{ boxShadow: '0 4px 12px rgba(255, 111, 97, 0.4)' }}
          >
            {t('home_get_started')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/about')}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: 'primary.light',
              },
            }}
          >
            {t('home_learn_more')}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}
