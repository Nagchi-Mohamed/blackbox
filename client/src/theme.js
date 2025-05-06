import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => {
  if (mode === 'blue') {
    return createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#0D47A1', // Darker blue for better contrast
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#FF6F61', // Vibrant coral for secondary actions
          contrastText: '#ffffff',
        },
        background: {
          default: '#F5F7FA', // Light grayish background for modern look
          paper: '#ffffff', // White paper background
        },
        text: {
          primary: '#212121', // Darker text for readability
          secondary: '#757575', // Medium gray for secondary text
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h2: {
          fontWeight: 700,
          fontSize: '3rem',
          letterSpacing: '-0.01562em',
          lineHeight: 1.2,
        },
        h6: {
          fontWeight: 400,
          fontSize: '1.25rem',
          lineHeight: 1.5,
          color: '#555555',
        },
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: '8px',
              padding: '10px 24px',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#FF6F61',
                color: '#ffffff',
              },
            },
            containedPrimary: {
              backgroundColor: '#0D47A1',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#08306b',
              },
            },
            outlinedPrimary: {
              borderColor: '#0D47A1',
              color: '#0D47A1',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#08306b',
              },
            },
          },
        },
      },
    });
  }

  return createTheme({
    palette: {
      mode: mode === 'dark' ? 'dark' : 'light',
      primary: {
        main: mode === 'blue' ? '#0D47A1' : '#3f51b5',
      },
    },
  });
};

export default getTheme;
