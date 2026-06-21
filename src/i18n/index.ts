import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import rw from "./rw";
import fr from "./fr";
import ar from "./ar";
import zh from "./zh";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { 
      en: { translation: en }, 
      rw: { translation: rw }, 
      fr: { translation: fr },
      ar: { translation: ar },
      zh: { translation: zh }
    },
    fallbackLng: "en",
    supportedLngs: ["en", "rw", "fr", "ar", "zh"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "simba_lang",
    },
  });

export default i18n;