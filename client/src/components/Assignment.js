import { Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { format } from 'date-fns';

const Assignment = ({ assignment }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {assignment.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {assignment.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`Due: ${format(new Date(assignment.dueDate), 'MMM dd, yyyy')}`}
            color="primary"
            size="small"
          />
          <Button variant="contained" size="small">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Assignment;