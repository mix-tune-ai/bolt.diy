import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { toast } from 'react-toastify';
import { classNames } from '~/utils/classNames';

const sidebarVariants: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: '100%',
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
};

export function SyncSidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const syncStatus = useStore(workbenchStore.syncStatus);
  const syncSettings = useStore(workbenchStore.syncSettings);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX } = e;
    const windowWidth = window.innerWidth;
    const threshold = 40; // pixels from the right edge

    if (clientX >= windowWidth - threshold) {
      setIsHovered(true);
    } else if (clientX < windowWidth - 300 && !isOpen) {
      // 300px is sidebar width
      setIsHovered(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      setIsHovered(false);
    }
  };

  const handleFolderSelect = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      await workbenchStore.setSyncFolder(handle);
      setIsOpen(true); // Keep sidebar open after selection
      toast.success('Sync folder selected successfully');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      console.error('Failed to set sync folder:', error);
      toast.error('Failed to set sync folder');
    }
  };

  const handleManualSync = async () => {
    if (!syncStatus.folderName) {
      toast.error('Please select a sync folder first');
      return;
    }

    try {
      setIsManualSyncing(true);
      await workbenchStore.syncFiles();
      toast.success('Manual sync completed successfully');
    } catch (error) {
      console.error('Failed to sync files:', error);
      toast.error('Manual sync failed');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const handleSaveSettings = (settings: Partial<typeof syncSettings>) => {
    workbenchStore.saveSyncSettings({
      ...syncSettings,
      ...settings,
    });
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div
        ref={sidebarRef}
        className={classNames(
          'fixed right-0 top-0 h-full w-[300px] z-50',
          'bg-white dark:bg-gray-950',
          'border-l border-gray-100 dark:border-gray-800/50',
          'shadow-sm',
        )}
        animate={isHovered || isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        initial="closed"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-12 flex items-center px-4 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <div className="i-ph:gear-six-duotone h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Sync Settings</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Sync Folder Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sync Folder</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800">
                  <div className="i-ph:folder-duotone text-gray-500 dark:text-gray-400" />
                  <span className="truncate">{syncStatus.folderName || 'No folder selected'}</span>
                </div>
                <button
                  onClick={handleFolderSelect}
                  className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <div className="i-ph:folder-simple-plus" />
                  Select
                </button>
              </div>
            </div>

            {/* Sync Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Settings</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="i-ph:arrows-clockwise-duotone" />
                    <span>Auto-sync</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSettings.autoSync}
                    onChange={(e) => handleSaveSettings({ autoSync: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-300 dark:border-gray-700"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="i-ph:floppy-disk-duotone" />
                    <span>Sync on save</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSettings.syncOnSave}
                    onChange={(e) => handleSaveSettings({ syncOnSave: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-300 dark:border-gray-700"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="i-ph:check-circle-duotone" />
                    <span>Default sync for new projects</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSettings.defaultSyncEnabled}
                    onChange={(e) => handleSaveSettings({ defaultSyncEnabled: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-purple-500 rounded border-gray-300 dark:border-gray-700"
                  />
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="i-ph:timer-duotone" />
                    <span>Auto-sync interval (minutes)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={syncSettings.autoSyncInterval}
                    onChange={(e) => handleSaveSettings({ autoSyncInterval: parseInt(e.target.value) || 1 })}
                    className="w-full bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Status Section */}
            {syncStatus.folderName && (
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="i-ph:info-duotone text-gray-500 dark:text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Status</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="i-ph:clock-duotone" />
                    <span>Last sync: {syncStatus.lastSync || 'Never'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="i-ph:files-duotone text-gray-500 dark:text-gray-400" />
                      <div className="text-xs text-gray-600 dark:text-gray-400">Files</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {syncStatus.totalFiles}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="i-ph:database-duotone text-gray-500 dark:text-gray-400" />
                      <div className="text-xs text-gray-600 dark:text-gray-400">Size</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">{syncStatus.totalSize}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Sync Button */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleManualSync}
              disabled={isManualSyncing || !syncStatus.folderName}
              className={classNames(
                'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                'bg-purple-500 hover:bg-purple-600 text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              <div className={classNames('i-ph:arrows-clockwise', { 'animate-spin': isManualSyncing })} />
              {isManualSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
