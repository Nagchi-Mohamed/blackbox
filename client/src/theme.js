import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' }
  }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212' }
  }
});

const darkBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    background: { default: '#0a1929' }
  }
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  darkBlue: darkBlueTheme
};