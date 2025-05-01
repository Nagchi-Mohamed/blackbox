import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            BrainyMath
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography component={Link} to="/login" sx={{ color: 'inherit', textDecoration: 'none' }}>
              Login
            </Typography>
            <Typography component={Link} to="/register" sx={{ color: 'inherit', textDecoration: 'none' }}>
              Register
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} BrainyMath. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 