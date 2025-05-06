import { Box, Typography, Button, Container, CircularProgress, Alert, Grid, Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useLessons } from '../context/LessonsContext';
import ClassroomListItem from '../components/ClassroomListItem';
import { School, Groups, Code, Assessment, Palette, TrendingUp } from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';

const Home = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { featuredLessons, fetchFeaturedLessons } = useLessons();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchFeaturedLessons();
        // Simulate fetching stats
        setStats({
          students: 12500,
          tutors: 650,
          successRate: 96,
          satisfaction: 98
        });
        setError(null);
      } catch (err) {
        setError(err.message || t('load_error'));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <Container maxWidth="xl">
      <Box sx={{ p: 4 }}>
        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          {[1,2,3].map(i => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );

  if (error) return (
    <Container maxWidth="xl">
      <Alert severity="error" sx={{ margin: 2 }}>{error}</Alert>
    </Container>
  );

  const StatCard = ({ value, label, icon: Icon }) => (
    <Paper sx={{ 
      p: 3, 
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Icon sx={{ fontSize: 40, mb: 2, color: theme.palette.primary.main }} />
      <Typography variant="h4" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)'
          : 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        borderRadius: 3,
        color: 'white',
        mb: 6,
        boxShadow: 3,
        px: 2
      }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          {t('welcome')} <Box component="span" sx={{ color: '#ffeb3b' }}>BrainyMath</Box>
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          {t('home_hero_subtitle')}
        </Typography>
        
        <Grid container spacing={4} sx={{ px: 4, py: 3 }}>
          <Grid item xs={12} md={4}>
            <School sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" gutterBottom>{t('personalized_learning')}</Typography>
            <Typography>{t('personalized_learning_desc')}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Groups sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" gutterBottom>{t('expert_tutors')}</Typography>
            <Typography>{t('expert_tutors_desc')}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Code sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6" gutterBottom>{t('interactive_tools')}</Typography>
            <Typography>{t('interactive_tools_desc')}</Typography>
          </Grid>
        </Grid>

        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/lessons';
          }}
          sx={{ 
            mt: 4, 
            px: 6, 
            py: 1.5, 
            fontSize: '1.1rem',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}
        >
          {t('get_started')}
        </Button>
      </Box>

      {/* Platform Stats */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={6} md={3}>
          <StatCard 
            value={`${stats.students.toLocaleString()}+`} 
            label={t('active_students')} 
            icon={Groups} 
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard 
            value={`${stats.tutors}+`} 
            label={t('qualified_tutors')} 
            icon={School} 
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard 
            value={`${stats.successRate}%`} 
            label={t('success_rate')} 
            icon={TrendingUp} 
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard 
            value={`${stats.satisfaction}%`} 
            label={t('satisfaction_rate')} 
            icon={Assessment} 
          />
        </Grid>
      </Grid>

      {/* Featured Lessons */}
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {t('featured_lessons')}
        </Typography>
        {Array.isArray(featuredLessons) && featuredLessons.length > 0 ? (
          <Grid container spacing={3}>
            {featuredLessons.map(lesson => (
              <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                <ClassroomListItem classroom={lesson} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">{t('no_lessons')}</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Home;