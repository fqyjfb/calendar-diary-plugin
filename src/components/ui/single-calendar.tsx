"use client";

import * as React from "react";
import { DayPicker, type ChevronProps } from "react-day-picker";
import "react-day-picker/style.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getDateLocale } from "@/lib/date-locale";
import { getCalendarFormatters, calendarStyle } from "@/lib/calendar-formatters";
import { cn } from "@/lib/utils";

import type { DayPickerSingleProps } from "react-day-picker";

function ChevronIcon({ orientation, size = 16 }: ChevronProps) {
  const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
  return <Icon className={`size-${size === 16 ? 4 : 5}`} />;
}

function SingleCalendar({ className, classNames, showOutsideDays = true, selected, style, ...props }: DayPickerSingleProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date | undefined>(selected instanceof Date ? selected : undefined);
  const { i18n } = useTranslation('calendar');
  const locale = getDateLocale(i18n.language);
  const formatters = React.useMemo(() => getCalendarFormatters(i18n.language), [i18n.language]);

  return (
    <DayPicker
      selected={selected}
      showOutsideDays={showOutsideDays}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      locale={locale}
      formatters={formatters}
      className={cn("p-3", className)}
      style={{ ...calendarStyle, ...style }}
      components={{
        Chevron: ChevronIcon,
      }}
      {...props}
    />
  );
}
SingleCalendar.displayName = "SingleCalendar";

export { SingleCalendar };