import { useMemo, Suspense, lazy } from "react";
import { isSameDay, parseISO } from "date-fns";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useCalendarStore } from "@/stores/calendar-store";
import { useEvents } from "@/hooks/use-events";
import { CalendarHeader } from "@/calendar/components/header/calendar-header";
import type { TCalendarView } from "@/calendar/types";

const CalendarMonthView = lazy(() =>
  import("@/calendar/components/month-view/calendar-month-view").then(module => ({
    default: module.CalendarMonthView,
  }))
);

const CalendarWeekView = lazy(() =>
  import("@/calendar/components/week-and-day-view/calendar-week-view").then(module => ({
    default: module.CalendarWeekView,
  }))
);

const CalendarDayView = lazy(() =>
  import("@/calendar/components/week-and-day-view/calendar-day-view").then(module => ({
    default: module.CalendarDayView,
  }))
);

const CalendarYearView = lazy(() =>
  import("@/calendar/components/year-view/calendar-year-view").then(module => ({
    default: module.CalendarYearView,
  }))
);

const CalendarAgendaView = lazy(() =>
  import("@/calendar/components/agenda-view/calendar-agenda-view").then(module => ({
    default: module.CalendarAgendaView,
  }))
);

function ViewLoadingFallback() {
  const { t } = useTranslation("calendar");
  return (
    <div className="p-8 text-center">
      <div className="mx-auto size-6 animate-spin rounded-full border-b-2 border-primary"></div>
      <p className="mt-2 text-sm text-muted-foreground">{t("common.loading")}</p>
    </div>
  );
}

export function ClientContainer() {
  const location = useLocation();
  const { t } = useTranslation("calendar");

  const selectedDate = useCalendarStore(state => state.selectedDate);
  const selectedType = useCalendarStore(state => state.selectedType);
  const { data: events = [], isLoading, error } = useEvents();

  const view = useMemo(() => {
    const pathSegments = location.pathname.split("/");
    const viewSegment = pathSegments[pathSegments.length - 1];

    const validViews: TCalendarView[] = ["month", "week", "day", "year", "agenda"];
    if (validViews.includes(viewSegment as TCalendarView)) {
      return viewSegment as TCalendarView;
    }

    return "month" as TCalendarView;
  }, [location.pathname]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = parseISO(event.endDate);
      const isTypeMatch = selectedType === "all" || event.type === selectedType;

      if (view === "month") {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart;
        return isInSelectedMonth && isTypeMatch;
      }

      if (view === "week") {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const isInSelectedWeek = eventStartDate <= weekEnd && eventEndDate >= weekStart;
        return isInSelectedWeek && isTypeMatch;
      }

      if (view === "day") {
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);

        const isInSelectedDay = eventStartDate <= dayEnd && eventEndDate >= dayStart;
        return isInSelectedDay && isTypeMatch;
      }

      if (view === "year") {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);

        const isInSelectedYear = eventStartDate <= yearEnd && eventEndDate >= yearStart;
        return isInSelectedYear && isTypeMatch;
      }

      if (view === "agenda") {
        const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
        const isInSelectedMonth = eventStartDate <= monthEnd && eventEndDate >= monthStart;
        return isInSelectedMonth && isTypeMatch;
      }

      return false;
    });
  }, [selectedDate, selectedType, events, view]);

  const singleDayEvents = useMemo(() => {
    return filteredEvents.filter(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      return isSameDay(startDate, endDate);
    });
  }, [filteredEvents]);

  const multiDayEvents = useMemo(() => {
    return filteredEvents.filter(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      return !isSameDay(startDate, endDate);
    });
  }, [filteredEvents]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <div className="p-8 text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">{t("loading.loadingEvents")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <div className="p-8 text-center">
          <p className="mb-2 text-red-600">{t("loading.failedToLoad")}</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <CalendarHeader events={filteredEvents} />

      <Suspense fallback={<ViewLoadingFallback />}>
        {view === "month" && <CalendarMonthView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "week" && <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "day" && <CalendarDayView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {view === "year" && <CalendarYearView allEvents={filteredEvents} />}
        {view === "agenda" && <CalendarAgendaView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />}
        {!["month", "week", "day", "year", "agenda"].includes(view) && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">{t("loading.viewNotImplemented", { view })}</p>
            <p className="text-sm text-muted-foreground">{t("loading.availableViews")}</p>
          </div>
        )}
      </Suspense>
    </div>
  );
}