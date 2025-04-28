import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Grid } from '@mui/material';
import ExerciseCard from '../components/exercises/ExerciseCard';

const Exercises = () => {
  const { t } = useTranslation();
  
  // Sample exercise data - this would come from an API in a real app
  const sampleExercises = [
    {
      title: "Quadratic Equations",
      question: "Solve for x: x² - 5x + 6 = 0",
      hint: t('exercises.hint'),
      solution: "x = 2 or x = 3",
      steps: [
        "Factor the quadratic: (x - 2)(x - 3) = 0",
        "Set each factor equal to zero: x - 2 = 0 or x - 3 = 0",
        "Solve for x: x = 2 or x = 3"
      ]
    },
    {
      title: "Linear Equations",
      question: "Solve for x: 2x + 5 = 13",
      hint: t('exercises.hint'),
      solution: "x = 4",
      steps: [
        "Subtract 5 from both sides: 2x = 8",
        "Divide both sides by 2: x = 4"
      ]
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('navigation.exercises')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {t('exercises.practice')}
        </Typography>

        <Grid container spacing={3}>
          {sampleExercises.map((exercise, index) => (
            <Grid item xs={12} key={index}>
              <ExerciseCard 
                exercise={exercise}
                level="High School"
                topic="Algebra"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Exercises; 