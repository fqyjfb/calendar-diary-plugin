import type { TEventColor, TEventType } from "@/calendar/types";

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  type: TEventType;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}