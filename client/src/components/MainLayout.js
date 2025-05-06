import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppBar from './AppBar';
import ThemeToggle from './ThemeToggle';
import useThemeMode from '../hooks/useThemeMode';

const MainLayout = () => {
  const { darkMode } = useThemeMode();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: darkMode ? '#121212' : '#f5f5f5' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          {/* Your app title/logo would go here */}
          <Box sx={{ flexGrow: 1 }} />
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;