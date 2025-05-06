import React from 'react';
import { Container } from '@mui/material';

const ClassroomsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ height: '90vh', paddingTop: 4 }}>
      <iframe
        title="Google Classroom"
        src="https://classroom.google.com/"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen
      />
    </Container>
  );
};

export default ClassroomsPage;
