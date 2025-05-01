import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const DarkModeToggle = () => {
  const { t } = useTranslation();
  const { mode, toggleMode } = useTheme();

  return (
    <Tooltip title={mode === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default DarkModeToggle; 