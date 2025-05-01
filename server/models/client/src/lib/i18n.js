import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations with error handling
let enTranslations = {};
let frTranslations = {};
let arTranslations = {};

try {
  enTranslations = require('../locales/en/translation.json');
} catch (e) {
  console.warn('English translations not found, using empty object');
}

try {
  frTranslations = require('../locales/fr/translation.json');
} catch (e) {
  console.warn('French translations not found, using empty object');
}

try {
  arTranslations = require('../locales/ar/translation.json');
} catch (e) {
  console.warn('Arabic translations not found, using empty object');
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
      ar: { translation: arTranslations },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie']
    }
  });

export default i18n; 