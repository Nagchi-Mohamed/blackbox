import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Stack, Divider, Typography, Box } from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';

const SocialButtons = ({ onError }) => {
  const { t } = useTranslation();
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      onError(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('auth.orContinueWith')}
        </Typography>
      </Divider>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<Google />}
          onClick={handleGoogleLogin}
          fullWidth
        >
          Google
        </Button>
        <Button
          variant="outlined"
          startIcon={<Facebook />}
          onClick={handleFacebookLogin}
          fullWidth
        >
          Facebook
        </Button>
      </Stack>
    </Box>
  );
};

export default SocialButtons; 