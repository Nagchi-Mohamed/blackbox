import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ForumPage = () => {
  const { t } = useTranslation();

  // Temporary categories - replace with API call
  const categories = [
    { id: 1, name: 'Algebra', threads: 15 },
    { id: 2, name: 'Geometry', threads: 9 }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 4 }}>{t('forum_categories')}</Typography>
      <Grid container spacing={3}>
        {categories.map(category => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{category.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                  {t('thread_count', { count: category.threads })}
                </Typography>
                <Button variant="contained" fullWidth href={`/forum/${category.id}`}>
                  {t('view_category')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ForumPage;