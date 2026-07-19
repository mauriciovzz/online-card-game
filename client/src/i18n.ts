import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en } from "./locales/en/translation";
import { es } from "./locales/es/translation";

const resources = { en: { translation: en }, es: { translation: es } };

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    debug: false,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
