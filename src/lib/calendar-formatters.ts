import { format } from "date-fns";
import type { CSSProperties } from "react";
import type { DayPicker } from "react-day-picker";

import { getDateLocale } from "./date-locale";

/**
 * CSS variables for react-day-picker v10, applied via inline `style` prop.
 * Inline styles have the highest specificity, guaranteeing overrides
 * regardless of CSS load order (v10's style.css defaults to blue).
 * Uses project design tokens (var(--primary), var(--accent)) for theme compatibility.
 */
export const calendarStyle: CSSProperties = {
  "--rdp-accent-color": "hsl(var(--primary))",
  "--rdp-accent-background-color": "hsl(var(--accent))",
  "--rdp-day-height": "2.25rem",
  "--rdp-day-width": "2.25rem",
  "--rdp-day_button-height": "2.25rem",
  "--rdp-day_button-width": "2.25rem",
  "--rdp-day_button-border": "1px solid transparent",
  "--rdp-day_button-border-radius": "0.375rem",
  "--rdp-selected-border": "1px solid hsl(var(--primary))",
  "--rdp-nav-height": "2.5rem",
  "--rdp-nav_button-height": "1.75rem",
  "--rdp-nav_button-width": "1.75rem",
} as CSSProperties;

export function getCalendarFormatters(language: string) {
  const locale = getDateLocale(language);

  const formatCaption = (date: Date) => {
    if (language === "ko") {
      return format(date, "yyyy년 M월", { locale });
    }
    if (language === "ja") {
      return format(date, "yyyy年M月", { locale });
    }
    if (language === "zh" || language === "zh-CN" || language === "zh-TW") {
      return format(date, "yyyy年M月", { locale });
    }
    if (language === "de") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "fr") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "es") {
      return format(date, "MMMM 'de' yyyy", { locale });
    }
    if (language === "it") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "pt" || language === "pt-BR") {
      return format(date, "MMMM 'de' yyyy", { locale });
    }
    if (language === "ru") {
      return format(date, "LLLL yyyy", { locale });
    }
    if (language === "nl") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "ar") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "hi") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "th") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "vi") {
      return format(date, "'Tháng' M 'năm' yyyy", { locale });
    }
    if (language === "id") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "sv") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "fi") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "da") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "no" || language === "nb") {
      return format(date, "MMMM yyyy", { locale });
    }
    if (language === "pl") {
      return format(date, "LLLL yyyy", { locale });
    }
    if (language === "cs") {
      return format(date, "LLLL yyyy", { locale });
    }
    if (language === "hu") {
      return format(date, "yyyy. MMMM", { locale });
    }
    if (language === "tr") {
      return format(date, "MMMM yyyy", { locale });
    }
    return format(date, "MMMM yyyy", { locale });
  };

  return {
    formatCaption,
    formatWeekdayName: (date: Date) => format(date, "EEE", { locale }),
  } as NonNullable<DayPicker["formatters"]>;
}