"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type ChevronProps } from "react-day-picker";
import "react-day-picker/style.css";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { getDateLocale } from "@/lib/date-locale";
import { getCalendarFormatters, calendarStyle } from "@/lib/calendar-formatters";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function ChevronIcon({ orientation, size = 16 }: ChevronProps) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
  return <Icon className={`size-${size === 16 ? 4 : 5}`} />;
}

function Calendar({ className, classNames, showOutsideDays = true, locale: propsLocale, style, ...props }: CalendarProps) {
  const { i18n } = useTranslation('calendar');
  const locale = propsLocale || getDateLocale(i18n.language);
  const formatters = React.useMemo(() => getCalendarFormatters(i18n.language), [i18n.language]);

  return (
    <DayPicker
      locale={locale}
      formatters={formatters}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      style={{ ...calendarStyle, ...style }}
      components={{
        Chevron: ChevronIcon,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };