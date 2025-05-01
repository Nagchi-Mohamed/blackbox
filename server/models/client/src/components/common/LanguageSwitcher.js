import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        className={i18n.language === 'fr' ? 'active' : ''}
      >
        Français
      </button>
      <button 
        onClick={() => changeLanguage('ar')}
        className={i18n.language === 'ar' ? 'active' : ''}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher; 