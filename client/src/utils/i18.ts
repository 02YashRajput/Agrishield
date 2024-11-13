
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector) 
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Dynamically load translation files when needed
      loadPath: '../locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['navigator', 'cookie', 'localStorage'],
      caches: ['cookie', 'localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
