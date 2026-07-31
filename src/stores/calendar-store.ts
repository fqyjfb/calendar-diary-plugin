import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IEvent } from '@/calendar/interfaces';
import type { TEventType, TCalendarView, TBadgeVariant, TVisibleHours, TWorkingHours } from '@/calendar/types';

const DEFAULT_WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

const DEFAULT_VISIBLE_HOURS: TVisibleHours = { from: 7, to: 18 };

interface CalendarState {
  currentView: TCalendarView;
  setCurrentView: (view: TCalendarView) => void;
  
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  
  selectedType: TEventType | 'all';
  setSelectedType: (type: TEventType | 'all') => void;
  
  badgeVariant: TBadgeVariant;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  
  workingHours: TWorkingHours;
  setWorkingHours: (hours: TWorkingHours) => void;
  visibleHours: TVisibleHours;
  setVisibleHours: (hours: TVisibleHours) => void;
  
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  
  reset: () => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, _get) => ({
      currentView: 'month',
      setCurrentView: (view) => set({ currentView: view }),
      
      selectedDate: new Date(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      selectedType: 'all',
      setSelectedType: (type) => set({ selectedType: type }),
      
      badgeVariant: 'colored',
      setBadgeVariant: (variant) => set({ badgeVariant: variant }),
      
      workingHours: DEFAULT_WORKING_HOURS,
      setWorkingHours: (hours) => set({ workingHours: hours }),
      visibleHours: DEFAULT_VISIBLE_HOURS,
      setVisibleHours: (hours) => set({ visibleHours: hours }),
      
      events: [],
      setEvents: (events) => set({ events }),
      
      reset: () => set({
        currentView: 'month',
        selectedDate: new Date(),
        selectedType: 'all',
        badgeVariant: 'colored',
        workingHours: DEFAULT_WORKING_HOURS,
        visibleHours: DEFAULT_VISIBLE_HOURS,
        events: [],
      }),
    }),
    {
      name: 'calendar-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        badgeVariant: state.badgeVariant,
        workingHours: state.workingHours,
        visibleHours: state.visibleHours,
      }),
    }
  )
);

export const useCalendarView = () => {
  const currentView = useCalendarStore((state) => state.currentView);
  const setCurrentView = useCalendarStore((state) => state.setCurrentView);
  return { currentView, setCurrentView };
};

export const useCalendarDate = () => {
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  return { selectedDate, setSelectedDate };
};

export const useCalendarType = () => {
  const selectedType = useCalendarStore((state) => state.selectedType);
  const setSelectedType = useCalendarStore((state) => state.setSelectedType);
  return { selectedType, setSelectedType };
};

export const useCalendarPreferences = () => {
  const badgeVariant = useCalendarStore((state) => state.badgeVariant);
  const setBadgeVariant = useCalendarStore((state) => state.setBadgeVariant);
  const workingHours = useCalendarStore((state) => state.workingHours);
  const setWorkingHours = useCalendarStore((state) => state.setWorkingHours);
  const visibleHours = useCalendarStore((state) => state.visibleHours);
  const setVisibleHours = useCalendarStore((state) => state.setVisibleHours);
  return { badgeVariant, setBadgeVariant, workingHours, setWorkingHours, visibleHours, setVisibleHours };
};

export const useCalendarEvents = () => {
  const events = useCalendarStore((state) => state.events);
  const setEvents = useCalendarStore((state) => state.setEvents);
  return { events, setEvents };
};