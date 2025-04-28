import { Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TeacherPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('teacher.dashboard')}
      </Typography>
      {/* Add teacher-specific content here */}
    </Container>
  );
};

export default TeacherPage; 