import { Card, CardContent, Typography, Button } from '@mui/material';

const ClassroomListItem = ({ classroom }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{classroom.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {classroom.description}
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          href={`/classrooms/${classroom.id}`}
        >
          Enter Classroom
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassroomListItem;