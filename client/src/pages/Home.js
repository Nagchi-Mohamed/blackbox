import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('Welcome to MathSphere')}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {t('Your comprehensive mathematics learning platform')}
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button 
            component={Link} 
            to="/courses" 
            variant="contained" 
            size="large"
          >
            {t('Browse Courses')}
          </Button>
          <Button 
            component={Link} 
            to="/classroom" 
            variant="outlined" 
            size="large"
          >
            {t('Try Classroom')}
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {t('Interactive Learning')}
              </Typography>
              <Typography color="text.secondary">
                {t('Engage with interactive lessons and real-time feedback')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {t('Personalized Progress')}
              </Typography>
              <Typography color="text.secondary">
                {t('Track your learning journey with detailed analytics')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {t('Expert Support')}
              </Typography>
              <Typography color="text.secondary">
                {t('Get help from qualified teachers and mentors')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 