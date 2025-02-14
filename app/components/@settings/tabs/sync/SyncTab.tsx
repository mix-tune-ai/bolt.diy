import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { syncSidebarStore } from '~/lib/stores/sync-sidebar';

export default function SyncTab() {
  const syncStatus = useStore(workbenchStore.syncStatus);
  const syncHistory = useStore(workbenchStore.syncHistory);
  const syncSettings = useStore(workbenchStore.syncSettings);

  return (
    <div className="p-6 space-y-8">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="i-ph:folder-duotone text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {syncStatus.folderName || 'No folder selected'}
            </span>
          </div>
          {syncStatus.folderName && (
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-800 pl-3">
              <div className="i-ph:clock-duotone" />
              <span>Last sync: {syncStatus.lastSync || 'Never'}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => syncSidebarStore.open()}
          className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <div className="i-ph:gear-six" />
          Configure Sync
        </button>
      </div>

      {/* Current Status */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="i-ph:chart-bar-duotone text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Status</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="i-ph:files-duotone text-gray-500 dark:text-gray-400" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{syncStatus.totalFiles || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="i-ph:database-duotone text-gray-500 dark:text-gray-400" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{syncStatus.totalSize || '0 B'}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="i-ph:arrows-clockwise-duotone text-gray-500 dark:text-gray-400" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Auto Sync</div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={classNames('h-2 w-2 rounded-full', syncSettings.autoSync ? 'bg-green-500' : 'bg-gray-400')}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {syncSettings.autoSync ? `Every ${syncSettings.autoSyncInterval}m` : 'Disabled'}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="i-ph:floppy-disk-duotone text-gray-500 dark:text-gray-400" />
              <div className="text-sm text-gray-600 dark:text-gray-400">Sync on Save</div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={classNames('h-2 w-2 rounded-full', syncSettings.syncOnSave ? 'bg-green-500' : 'bg-gray-400')}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {syncSettings.syncOnSave ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="i-ph:clock-countdown-duotone text-gray-500 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sync History</h2>
          </div>
          {syncHistory.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {syncHistory.length} {syncHistory.length === 1 ? 'entry' : 'entries'}
            </div>
          )}
        </div>
        <div className="space-y-3">
          {syncHistory.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center">
              <div className="i-ph:clock-counter-clockwise-duotone text-gray-400 dark:text-gray-600 text-4xl mx-auto mb-3" />
              <div className="text-sm text-gray-600 dark:text-gray-400">No sync history available</div>
            </div>
          ) : (
            syncHistory.map((entry) => (
              <div key={entry.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="i-ph:folder-notch-duotone text-gray-500 dark:text-gray-400" />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.projectName}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="i-ph:clock-duotone" />
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-full">
                        {(entry.statistics.duration / 1000).toFixed(1)}s
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <div className="i-ph:files-duotone" />
                      <span>{entry.files.length} files</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <div className="i-ph:database-duotone" />
                      <span>{(entry.statistics.totalSize / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                </div>
                {entry.files.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Files:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {entry.files.slice(0, 4).map((file) => (
                        <div key={file} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <div className="i-ph:file-text-duotone" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                      {entry.files.length > 4 && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                          <div className="i-ph:dots-three-outline-duotone" />
                          <span>+{entry.files.length - 4} more files</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
