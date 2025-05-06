import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const RTLLayout = ({ children }) => {
  const { i18n } = useTranslation();
  return (
    <Box dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </Box>
  );
};

export default RTLLayout;