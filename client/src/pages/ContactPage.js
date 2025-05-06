import { Container, Typography, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{t('contact_us')}</Typography>
      <form>
        <TextField
          fullWidth
          margin="normal"
          label={t('name')}
          variant="outlined"
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('email')}
          variant="outlined"
          type="email"
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label={t('message')}
          variant="outlined"
          multiline
          rows={4}
          required
        />
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          type="submit"
        >
          {t('send_message')}
        </Button>
      </form>
    </Container>
  );
};

export default ContactPage;