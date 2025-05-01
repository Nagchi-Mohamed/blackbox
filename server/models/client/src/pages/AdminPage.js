import { Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('admin.dashboard')}
      </Typography>
      {/* Add admin-specific content here */}
    </Container>
  );
};

export default AdminPage; 