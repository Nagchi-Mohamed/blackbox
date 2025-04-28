import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { arSA, enUS, frFR } from '@mui/material/locale';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [language, setLanguage] = useState('en');
  
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const getLocale = () => {
    switch(language) {
      case 'ar': return arSA;
      case 'fr': return frFR;
      default: return enUS;
    }
  };

  const theme = useMemo(() => createTheme({
    direction: language === 'ar' ? 'rtl' : 'ltr',
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#9c27b0' : '#ce93d8',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: language === 'ar' 
        ? '"Tajawal", "Arial", sans-serif'
        : '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  }, getLocale()), [mode, language]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode, setLanguage }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 