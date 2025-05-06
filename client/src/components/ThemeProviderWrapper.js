import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import getTheme from '../theme';

const ThemeProviderWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      {children({ theme, darkMode, toggleDarkMode })}
    </ThemeProvider>
  );
};

export default ThemeProviderWrapper;