import { useTranslation } from 'react-i18next';

const TranslationFallback = ({ children, fallback }) => {
  const { t, i18n } = useTranslation();
  
  if (!t(children)) {
    console.warn(`Missing translation for key: ${children}`);
    return fallback || children;
  }
  
  return t(children);
};

export default TranslationFallback;