import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/resources.js';

i18next
  .use(initReactI18next)
  .init({
    resources,
    interpolation: {
      escapeValue: false,
    },
    fallbackLng: 'ru',
    debug: true,
  });

export default i18next;
