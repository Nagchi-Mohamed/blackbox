import { useTheme } from '../../contexts/ThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ThemeToggle = () => {
  const { toggleTheme, mode } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Tooltip title={mode === 'light' ? t('settings.darkMode') : t('settings.lightMode')}>
      <IconButton
        color="inherit"
        onClick={toggleTheme}
        aria-label="toggle theme"
      >
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 