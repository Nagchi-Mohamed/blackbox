import i18n from 'i18next';

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('preferredLanguage', lang);
};

export const getCurrentLanguage = () => {
  return i18n.language || localStorage.getItem('preferredLanguage') || 'en';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString(i18n.language);
};