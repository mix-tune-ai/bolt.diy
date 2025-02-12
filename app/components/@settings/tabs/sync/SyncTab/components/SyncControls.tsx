import { Button } from '~/components/ui/Button';

interface SyncControlsProps {
  onSync: () => Promise<void>;
  isSyncing: boolean;
  hasSyncFolder: boolean;
}

export default function SyncControls({ onSync, isSyncing, hasSyncFolder }: SyncControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button onClick={onSync} disabled={isSyncing || !hasSyncFolder} className="flex items-center gap-2">
        <div className={`i-ph:cloud-arrow-up ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Now'}
      </Button>
      {!hasSyncFolder && (
        <div className="text-sm text-bolt-elements-textSecondary">Please select a sync folder in settings</div>
      )}
    </div>
  );
}
