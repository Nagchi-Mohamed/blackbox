import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const RTLLayout = ({ children }) => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return children;
};

export default RTLLayout;