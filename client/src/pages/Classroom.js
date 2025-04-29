import React from 'react';
import { Container, Typography } from '@mui/material';
import VirtualClassroom from '../components/classroom/VirtualClassroom';
import { useTranslation } from 'react-i18next';

const Classroom = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        {t('navigation.classroom')}
      </Typography>
      <VirtualClassroom />
    </Container>
  );
};

export default Classroom; 