import { createTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const getTheme = () => {
  const { i18n } = useTranslation();
  return createTheme({
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
    // ... existing theme configuration ...
  });
};

export default getTheme;