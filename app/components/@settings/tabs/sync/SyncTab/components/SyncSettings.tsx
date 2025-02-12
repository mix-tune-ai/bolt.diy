import { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { syncSettingsStore, updateSyncSettings } from '~/lib/stores/sync';
import { Switch } from '@radix-ui/react-switch';
import { classNames } from '~/utils/classNames';
import { toast } from 'react-toastify';
import type { SyncSettings } from '~/types/sync';

export default function SyncSettings() {
  const syncSettings = useStore(syncSettingsStore);

  const updateSetting = useCallback((key: keyof SyncSettings, value: any) => {
    try {
      updateSyncSettings({ [key]: value });
      toast.success(`${key} setting updated`);
    } catch (error) {
      console.error(`Failed to update ${key} setting:`, error);
      toast.error(`Failed to update ${key} setting`);
    }
  }, []);

  return (
    <div className="space-y-4 p-4 bg-bolt-elements-background-depth-2 rounded-lg">
      <h3 className="text-md font-medium text-bolt-elements-textPrimary">Sync Settings</h3>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-bolt-elements-textPrimary">Auto Sync</div>
          <div className="text-xs text-bolt-elements-textSecondary">
            Automatically sync changes when files are modified
          </div>
        </div>
        <Switch
          checked={syncSettings.autoSync}
          onCheckedChange={(checked) => updateSetting('autoSync', checked)}
          className={classNames(
            'relative inline-flex h-5 w-9 items-center rounded-full',
            'transition-colors duration-200',
            syncSettings.autoSync ? 'bg-purple-500' : 'bg-bolt-elements-background-depth-4',
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-bolt-elements-textPrimary">Sync on Save</div>
          <div className="text-xs text-bolt-elements-textSecondary">Automatically sync files when they are saved</div>
        </div>
        <Switch
          checked={syncSettings.syncOnSave}
          onCheckedChange={(checked) => updateSetting('syncOnSave', checked)}
          className={classNames(
            'relative inline-flex h-5 w-9 items-center rounded-full',
            'transition-colors duration-200',
            syncSettings.syncOnSave ? 'bg-purple-500' : 'bg-bolt-elements-background-depth-4',
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-bolt-elements-textPrimary">Auto Sync Interval</div>
          <div className="text-xs text-bolt-elements-textSecondary">
            How often to automatically sync files (in minutes)
          </div>
        </div>
        <select
          value={syncSettings.autoSyncInterval}
          onChange={(e) => updateSetting('autoSyncInterval', parseInt(e.target.value))}
          className="bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary border border-bolt-elements-borderColor rounded-md px-2 py-1"
        >
          <option value="1">1 minute</option>
          <option value="5">5 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-bolt-elements-textPrimary">Sync Mode</div>
          <div className="text-xs text-bolt-elements-textSecondary">How to handle file conflicts during sync</div>
        </div>
        <select
          value={syncSettings.syncMode}
          onChange={(e) => updateSetting('syncMode', e.target.value)}
          className="bg-bolt-elements-background-depth-3 text-bolt-elements-textPrimary border border-bolt-elements-borderColor rounded-md px-2 py-1"
        >
          <option value="ask">Ask</option>
          <option value="overwrite">Overwrite</option>
          <option value="skip">Skip</option>
        </select>
      </div>
    </div>
  );
}
