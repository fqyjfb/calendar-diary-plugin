import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCalendar from "@/i18n/locales/en/calendar.json";
import koCalendar from "@/i18n/locales/ko/calendar.json";
import jaCalendar from "@/i18n/locales/ja/calendar.json";
import zhCalendar from "@/i18n/locales/zh/calendar.json";

i18n
  .use(initReactI18next)
  .init({
    lng: "zh",
    fallbackLng: "zh",
    debug: false,
    defaultNS: "calendar",
    ns: ["calendar"],

    resources: {
      en: {
        calendar: enCalendar,
      },
      ko: {
        calendar: koCalendar,
      },
      ja: {
        calendar: jaCalendar,
      },
      zh: {
        calendar: zhCalendar,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
