import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
      zh: {
        calendar: zhCalendar,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;