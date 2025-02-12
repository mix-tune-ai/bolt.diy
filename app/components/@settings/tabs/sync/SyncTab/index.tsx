import { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import SyncSettings from './components/SyncSettings';
import SyncStats from '~/components/@settings/tabs/sync/SyncStats/SyncStats';
import SyncControls from './components/SyncControls';

/*
 * Commented out for now as it might be needed later
 * const TIME_RANGES: Record<TimeRange, number> = {
 *   '1h': 60 * 60 * 1000,
 *   '24h': 24 * 60 * 60 * 1000,
 *   '7d': 7 * 24 * 60 * 60 * 1000,
 *   '30d': 30 * 24 * 60 * 60 * 1000,
 *   all: Infinity,
 * };
 */

export function SyncTab() {
  const session = useStore(workbenchStore.currentSession);
  const syncFolder = useStore(workbenchStore.syncFolder);
  const isSyncing = useStore(workbenchStore.isSyncing);

  const handleSync = useCallback(async () => {
    if (!syncFolder) {
      alert('Please select a sync folder first');
      return;
    }

    try {
      await workbenchStore.syncFiles();
    } catch (error) {
      console.error('Sync failed:', error);
      alert(error instanceof Error ? error.message : 'Sync failed');
    }
  }, [syncFolder]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <h3 className="text-lg font-medium mb-2">No Active Session</h3>
        <p className="text-gray-500 dark:text-gray-400">Open a project to start syncing files</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <SyncSettings />

      <SyncControls onSync={handleSync} isSyncing={isSyncing} hasSyncFolder={!!syncFolder} />

      <SyncStats />
    </div>
  );
}

export default SyncTab;
