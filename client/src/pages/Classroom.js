import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';
import VirtualClassroom from '../components/classroom/VirtualClassroom';

const Classroom = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="xl" sx={{ height: '100vh', p: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('navigation.classroom')}
      </Typography>
      <VirtualClassroom roomId="demo-room" />
    </Container>
  );
};

export default Classroom; 