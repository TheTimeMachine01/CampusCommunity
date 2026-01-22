import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache keys
export const CACHE_KEYS = {
  NEWS: '@campus_news',
  CLUBS: '@campus_clubs',
  CLUB_UPDATES: '@campus_club_updates_',
  PENDING_ACTIONS: '@campus_pending_actions',
  LAST_SYNC: '@campus_last_sync',
  USER_DATA: '@campus_user_data',
  NOTIFICATIONS: '@campus_notifications',
};

// Generic storage functions
export const storage = {
  // Get item from storage
  getItem: async <T,>(key: string, defaultValue?: T): Promise<T | null> => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Storage: Error getting item ${key}:`, error);
      return defaultValue || null;
    }
  },

  // Set item in storage
  setItem: async <T,>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log(`Storage: Item saved - ${key}`);
    } catch (error) {
      console.error(`Storage: Error setting item ${key}:`, error);
    }
  },

  // Remove item from storage
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Storage: Item removed - ${key}`);
    } catch (error) {
      console.error(`Storage: Error removing item ${key}:`, error);
    }
  },

  // Clear all storage
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      console.log('Storage: All items cleared');
    } catch (error) {
      console.error('Storage: Error clearing storage:', error);
    }
  },

  // Get multiple items
  multiGet: async (keys: string[]): Promise<{ [key: string]: any }> => {
    try {
      const items = await AsyncStorage.multiGet(keys);
      const result: { [key: string]: any } = {};
      items.forEach(([key, value]: [string, string | null]) => {
        if (value !== null) {
          result[key] = JSON.parse(value);
        }
      });
      return result;
    } catch (error) {
      console.error('Storage: Error getting multiple items:', error);
      return {};
    }
  },
};

// News-specific cache functions
export const newsCache = {
  save: async (news: any[]): Promise<void> => {
    await storage.setItem(CACHE_KEYS.NEWS, {
      data: news,
      timestamp: new Date().toISOString(),
    });
  },

  get: async (): Promise<any[] | null> => {
    const cached = await storage.getItem<{ data: any[]; timestamp: string }>(CACHE_KEYS.NEWS);
    return cached?.data || null;
  },

  clear: async (): Promise<void> => {
    await storage.removeItem(CACHE_KEYS.NEWS);
  },
};

// Clubs-specific cache functions
export const clubsCache = {
  save: async (clubs: any[]): Promise<void> => {
    await storage.setItem(CACHE_KEYS.CLUBS, {
      data: clubs,
      timestamp: new Date().toISOString(),
    });
  },

  get: async (): Promise<any[] | null> => {
    const cached = await storage.getItem<{ data: any[]; timestamp: string }>(CACHE_KEYS.CLUBS);
    return cached?.data || null;
  },

  clear: async (): Promise<void> => {
    await storage.removeItem(CACHE_KEYS.CLUBS);
  },
};

// Club updates cache
export const clubUpdatesCache = {
  save: async (clubId: string, updates: any[]): Promise<void> => {
    await storage.setItem(CACHE_KEYS.CLUB_UPDATES + clubId, {
      data: updates,
      timestamp: new Date().toISOString(),
    });
  },

  get: async (clubId: string): Promise<any[] | null> => {
    const cached = await storage.getItem<{ data: any[]; timestamp: string }>(
      CACHE_KEYS.CLUB_UPDATES + clubId
    );
    return cached?.data || null;
  },

  clear: async (clubId: string): Promise<void> => {
    await storage.removeItem(CACHE_KEYS.CLUB_UPDATES + clubId);
  },
};

// Sync metadata
export const syncMetadata = {
  setLastSync: async (): Promise<void> => {
    await storage.setItem(CACHE_KEYS.LAST_SYNC, new Date().toISOString());
  },

  getLastSync: async (): Promise<Date | null> => {
    const timestamp = await storage.getItem<string>(CACHE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  },
};

// Plan 4: Notification cache
export const notificationsCache = {
  save: async (notifications: any[]): Promise<void> => {
    await storage.setItem(CACHE_KEYS.NOTIFICATIONS, notifications);
  },

  get: async (): Promise<any[] | null> => {
    return storage.getItem(CACHE_KEYS.NOTIFICATIONS);
  },

  addNotification: async (notification: any): Promise<void> => {
    const existing = await notificationsCache.get();
    const updated = existing ? [notification, ...existing] : [notification];
    await notificationsCache.save(updated);
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    const notifications = await notificationsCache.get();
    if (notifications) {
      const updated = notifications.map((n: any) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      await notificationsCache.save(updated);
    }
  },

  markAllAsRead: async (): Promise<void> => {
    const notifications = await notificationsCache.get();
    if (notifications) {
      const updated = notifications.map((n: any) => ({ ...n, isRead: true }));
      await notificationsCache.save(updated);
    }
  },

  clear: async (): Promise<void> => {
    await storage.removeItem(CACHE_KEYS.NOTIFICATIONS);
  },
};
