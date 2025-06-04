import i18n from "i18next";
import { initReactI18next, Translation } from "react-i18next";

import TranslationEn from "./locals/en/translation.json";
import TranslationRu from "./locals/ru/translation.json";
import TranslationAm from "./locals/am/translation.json";

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
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        debug: true,
    });

export default i18n;