import { useState, useEffect } from 'react';

const useThemeMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or prefer-color-scheme
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return savedMode === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.style.backgroundColor = darkMode ? '#121212' : '#ffffff';
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return { darkMode, toggleDarkMode };
};

export default useThemeMode;