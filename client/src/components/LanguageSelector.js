import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem } from '@mui/material';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(() => {
    const lang = i18n.language || 'en';
    return lang.split('-')[0]; // normalize language code
  });

  const handleChange = async (event) => {
    const lng = event.target.value;
    try {
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        setCurrentLanguage(lng.split('-')[0]); // normalize language code
      } else {
        console.error('i18n instance not properly initialized');
      }
    } catch (error) {
      console.error('Language change failed:', error);
      // Fallback to English if change fails
      i18n.changeLanguage('en');
    }
  };

  return (
      <Select
        value={currentLanguage}
        onChange={handleChange}
        sx={{
          color: 'white',
          minWidth: 100,
          '& .MuiSelect-select': {
            paddingLeft: 1,
            paddingRight: 1,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '& .MuiSvgIcon-root': {
            display: 'none',
          },
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="es">Español</MenuItem>
      </Select>
  );
};

export default LanguageSelector;
