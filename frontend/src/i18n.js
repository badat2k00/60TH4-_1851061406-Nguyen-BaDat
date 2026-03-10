// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import translationEN from "./locales/en.json";
import translationVI from "./locales/vi.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "vi", // Default language
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
