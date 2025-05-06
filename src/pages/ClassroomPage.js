import React from 'react';
import { Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClassroomPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        padding: '0 16px'
      }}>
        <Typography variant="h4" style={{ 
          fontFamily: "'Google Sans Text', sans-serif",
          fontWeight: 500,
          color: '#3c4043'
        }}>
          Your Classes
        </Typography>
        <Button 
          variant="contained"
          style={{
            backgroundColor: '#1a73e8',
            color: 'white',
            textTransform: 'none',
            borderRadius: '24px',
            padding: '8px 24px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
          onClick={() => navigate('/classroom/create')}
        >
          Create Class
        </Button>
      </div>

      <Grid container spacing={3}>
        {classrooms.map((classroom) => (
          <Grid item xs={12} sm={6} md={4} key={classroom.id}>
            <Card 
              style={{ 
                border: '1px solid #dadce0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent style={{ padding: '16px' }}>
                <Typography 
                  variant="h6" 
                  style={{ 
                    fontFamily: "'Google Sans Text', sans-serif",
                    fontWeight: 500,
                    marginBottom: '8px'
                  }}
                >
                  {classroom.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: '#5f6368',
                    fontFamily: "'Google Sans Text', sans-serif"
                  }}
                >
                  {classroom.section}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ClassroomPage;