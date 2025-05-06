import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const GroupsPage = () => {
  const { t } = useTranslation();

  // Temporary static data - replace with API call
  const groups = [
    { id: 1, name: 'Algebra Study Group', description: 'Master algebraic equations' },
    { id: 2, name: 'Geometry Club', description: 'Explore geometric principles' }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 4 }}>{t('study_groups')}</Typography>
      <Grid container spacing={3}>
        {groups.map(group => (
          <Grid item xs={12} sm={6} md={4} key={group.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{group.name}</Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                  {group.description}
                </Typography>
                <Button variant="contained" fullWidth>
                  {t('join_group')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GroupsPage;