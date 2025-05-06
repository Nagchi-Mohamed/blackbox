import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Typography variant="h4">{t('unauthorized_error_code')}</Typography>
      <Typography variant="body1">
        {t('unauthorized_error_message')}
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        {t('return_home')}
      </Button>
    </div>
  );
};

export default Unauthorized;
