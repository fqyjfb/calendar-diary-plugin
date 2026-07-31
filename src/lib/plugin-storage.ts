const STORAGE_KEY = "calendar-diary-plugin";

function getPluginData() {
  const pluginData = (window as any).__PLUGIN_DATA__;
  return {
    pluginId: pluginData?.pluginId || "calendar-diary-plugin",
    userId: pluginData?.userId || "default",
  };
}

function isElectronStorageAvailable(): boolean {
  return !!(window as any).electron?.plugin?.storage;
}

export class PluginStorage {
  private pluginId: string;
  private userId: string;

  constructor() {
    const { pluginId, userId } = getPluginData();
    this.pluginId = pluginId;
    this.userId = userId;
  }

  async getConfig<T>(): Promise<T | null> {
    if (isElectronStorageAvailable()) {
      const result = await (window as any).electron.plugin.storage.get(
        this.pluginId,
        this.userId,
        "config"
      );
      return result as T | null;
    }
    const raw = localStorage.getItem(`${STORAGE_KEY}:config`);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async saveConfig<T>(config: T): Promise<void> {
    if (isElectronStorageAvailable()) {
      await (window as any).electron.plugin.storage.set(
        this.pluginId,
        this.userId,
        "config",
        config
      );
      return;
    }
    localStorage.setItem(`${STORAGE_KEY}:config`, JSON.stringify(config));
  }

  async getEvents(): Promise<unknown[]> {
    if (isElectronStorageAvailable()) {
      const result = await (window as any).electron.plugin.storage.get(
        this.pluginId,
        this.userId,
        "events"
      );
      return Array.isArray(result) ? result : [];
    }
    const raw = localStorage.getItem(`${STORAGE_KEY}:events`);
    return raw ? JSON.parse(raw) : [];
  }

  async saveEvents(events: unknown[]): Promise<void> {
    if (isElectronStorageAvailable()) {
      await (window as any).electron.plugin.storage.set(
        this.pluginId,
        this.userId,
        "events",
        events
      );
      return;
    }
    localStorage.setItem(`${STORAGE_KEY}:events`, JSON.stringify(events));
  }

  async getEventTypes(): Promise<string[]> {
    if (isElectronStorageAvailable()) {
      const result = await (window as any).electron.plugin.storage.get(
        this.pluginId,
        this.userId,
        "eventTypes"
      );
      return Array.isArray(result) ? result : [];
    }
    const raw = localStorage.getItem(`${STORAGE_KEY}:eventTypes`);
    return raw ? JSON.parse(raw) : [];
  }

  async saveEventTypes(types: string[]): Promise<void> {
    if (isElectronStorageAvailable()) {
      await (window as any).electron.plugin.storage.set(
        this.pluginId,
        this.userId,
        "eventTypes",
        types
      );
      return;
    }
    localStorage.setItem(`${STORAGE_KEY}:eventTypes`, JSON.stringify(types));
  }

  async getState<T>(key: string, defaultValue: T): Promise<T> {
    if (isElectronStorageAvailable()) {
      const result = await (window as any).electron.plugin.storage.get(
        this.pluginId,
        this.userId,
        key
      );
      if (result !== null && result !== undefined) {
        return result as T;
      }
      return defaultValue;
    }
    const raw = localStorage.getItem(`${STORAGE_KEY}:${key}`);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  }

  async setState<T>(key: string, value: T): Promise<void> {
    if (isElectronStorageAvailable()) {
      await (window as any).electron.plugin.storage.set(
        this.pluginId,
        this.userId,
        key,
        value
      );
      return;
    }
    localStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(value));
  }

  async deleteState(key: string): Promise<void> {
    if (isElectronStorageAvailable()) {
      await (window as any).electron.plugin.storage.delete(
        this.pluginId,
        this.userId,
        key
      );
      return;
    }
    localStorage.removeItem(`${STORAGE_KEY}:${key}`);
  }
}