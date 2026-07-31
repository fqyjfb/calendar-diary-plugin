import { PluginStorage } from "@/lib/plugin-storage";
import type { IEvent } from "@/calendar/interfaces";

const storage = new PluginStorage();

export async function getEvents(): Promise<IEvent[]> {
  const events = await storage.getEvents();
  return events as IEvent[];
}

export async function createEvent(eventData: Omit<IEvent, "id">): Promise<IEvent> {
  const events = await storage.getEvents();
  const newEvent: IEvent = {
    ...(eventData as IEvent),
    id: Date.now(),
  };
  events.push(newEvent);
  await storage.saveEvents(events);
  return newEvent;
}

export async function updateEvent(eventData: IEvent): Promise<IEvent> {
  const events = await storage.getEvents();
  const index = events.findIndex((e: any) => e.id === eventData.id);
  if (index !== -1) {
    events[index] = eventData;
    await storage.saveEvents(events);
  }
  return eventData;
}

export async function deleteEvent(eventId: number): Promise<void> {
  const events = await storage.getEvents();
  const filtered = events.filter((e: any) => e.id !== eventId);
  await storage.saveEvents(filtered);
}