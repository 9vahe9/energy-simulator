import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import TranslationEn from "./locals/en/translation.json";
import TranslationRu from "./locals/ru/translation.json";
import TranslationAm from "./locals/am/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: TranslationEn,
    },
    ru: {
        translation: TranslationRu,
    },
    am: {
        translation: TranslationAm,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage"],
            caches: ["localStorage"],
        },
        debug: true,
    });

export default i18n;