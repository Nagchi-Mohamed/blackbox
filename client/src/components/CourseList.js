import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const CourseList = ({ courses }) => {
  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component={Link} to={`/courses/${course._id}`}>
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {course.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseList;