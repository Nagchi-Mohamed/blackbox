import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../utils/localization';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  
  return (
    <select 
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
};

export default LanguageSelector;