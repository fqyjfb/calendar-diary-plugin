import { create } from 'zustand';
import { PluginStorage } from '@/lib/plugin-storage';

const storage = new PluginStorage();
const DEFAULT_TYPES = ['work', 'study', 'life', 'other'];

interface EventTypeState {
  customTypes: string[];
  loaded: boolean;
  loadTypes: () => Promise<void>;
  addType: (type: string) => Promise<void>;
  renameType: (oldType: string, newName: string) => Promise<void>;
  removeType: (type: string) => Promise<void>;
}

export const useEventTypeStore = create<EventTypeState>((set, get) => ({
  customTypes: [],
  loaded: false,

  loadTypes: async () => {
    const types = await storage.getEventTypes();
    set({ customTypes: types, loaded: true });
  },

  addType: async (type: string) => {
    const trimmed = type.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    const { customTypes } = get();
    if ([...DEFAULT_TYPES, ...customTypes].includes(normalized)) return;
    const next = [...customTypes, normalized];
    set({ customTypes: next });
    await storage.saveEventTypes(next);
  },

  renameType: async (oldType: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    if (DEFAULT_TYPES.includes(oldType)) return;
    const { customTypes } = get();
    const next = customTypes.map((t) => (t === oldType ? normalized : t));
    set({ customTypes: next });
    await storage.saveEventTypes(next);
  },

  removeType: async (type: string) => {
    if (DEFAULT_TYPES.includes(type)) return;
    const { customTypes } = get();
    const next = customTypes.filter((t) => t !== type);
    set({ customTypes: next });
    await storage.saveEventTypes(next);
  },
}));