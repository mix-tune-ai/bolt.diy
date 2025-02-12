import { atom, map } from 'nanostores';
import type { SyncHistoryEntry, SyncSettings } from '~/types/sync';
import { generateId } from '~/utils/fileUtils';

// Store for sync history
export const syncHistoryStore = atom<SyncHistoryEntry[]>([]);

// Store for sync settings with defaults
export const syncSettingsStore = map<SyncSettings>({
  autoSync: true,
  autoSyncInterval: 5, // 5 minutes
  syncOnSave: true,
  excludePatterns: ['node_modules/**', '.git/**', 'dist/**', '*.log'],
  syncMode: 'ask',
  projectFolders: {},
  defaultSyncEnabled: true,
});

// Helper functions for managing sync history
export function addSyncEntry(entry: Omit<SyncHistoryEntry, 'id'>) {
  const newEntry: SyncHistoryEntry = {
    id: generateId(),
    ...entry,
  };

  syncHistoryStore.set([newEntry, ...syncHistoryStore.get()]);

  return newEntry;
}

export function clearSyncHistory() {
  syncHistoryStore.set([]);
}

// Helper functions for managing sync settings
export function updateSyncSettings(settings: Partial<SyncSettings>) {
  syncSettingsStore.set({
    ...syncSettingsStore.get(),
    ...settings,
  });
}

// Load initial data from localStorage if available
try {
  const savedHistory = localStorage.getItem('syncHistory');

  if (savedHistory) {
    syncHistoryStore.set(JSON.parse(savedHistory));
  }

  const savedSettings = localStorage.getItem('syncSettings');

  if (savedSettings) {
    syncSettingsStore.set(JSON.parse(savedSettings));
  }
} catch (error) {
  console.error('Failed to load sync data from localStorage:', error);
}

// Save to localStorage when data changes
syncHistoryStore.subscribe((history) => {
  try {
    localStorage.setItem('syncHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save sync history to localStorage:', error);
  }
});

syncSettingsStore.subscribe((settings) => {
  try {
    localStorage.setItem('syncSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save sync settings to localStorage:', error);
  }
});
