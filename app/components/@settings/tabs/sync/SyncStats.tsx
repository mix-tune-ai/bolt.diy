import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import type { SyncSession } from '~/types/sync';
import { useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import { formatFileSize } from '~/utils/fileUtils';
import StatsCard from './StatsCard';
import HistoryEntry from './HistoryEntry';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function SyncStats() {
  const currentSession = useStore(workbenchStore.currentSession);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [isClearing, setIsClearing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const totalPages = Math.ceil((currentSession?.history?.length || 0) / ITEMS_PER_PAGE);

  const handleToggleEntry = (id: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const handleExport = () => {
    if (!currentSession?.history) {
      return;
    }

    const exportData = {
      history: currentSession.history,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sync-history-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('History exported successfully');
  };

  const handleClearHistory = async () => {
    if (!currentSession) {
      return;
    }

    try {
      setIsClearing(true);

      const clearedSession: SyncSession = {
        id: currentSession.id,
        timestamp: currentSession.timestamp,
        lastSync: currentSession.lastSync,
        projectName: currentSession.projectName,
        projectFolder: currentSession.projectFolder,
        history: [],
        statistics: [],
        files: new Set<string>(),
      };

      await workbenchStore.currentSession.set(clearedSession);
      toast.success('History cleared successfully');
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast.error('Failed to clear history');
    } finally {
      setIsClearing(false);
    }
  };

  const getFilteredHistory = useCallback(() => {
    if (!currentSession?.history) {
      return [];
    }

    return currentSession.history.filter((entry) => {
      if (!searchQuery) {
        return true;
      }

      return entry.files.some((file) => file.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [currentSession?.history, searchQuery]);

  // Calculate sync rate based on synced files and duration
  const getSyncRate = () => {
    const latestStats = currentSession?.statistics?.[0];

    if (!latestStats) {
      return 0;
    }

    const durationInMinutes = latestStats.duration / (1000 * 60); // Convert ms to minutes

    return durationInMinutes > 0 ? Math.round(latestStats.syncedFiles / durationInMinutes) : 0;
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          label="Total Files"
          value={currentSession?.files?.size || 0}
          icon="i-ph:files-duotone"
          trend={{
            direction: 'up',
            percentage: 12,
            progress: 0.75,
          }}
        />
        <StatsCard
          label="Total Size"
          value={formatFileSize(Array.from(currentSession?.files || []).reduce((acc, file) => acc + file.length, 0))}
          icon="i-ph:database-duotone"
          trend={{
            direction: 'up',
            percentage: 8,
            progress: 0.65,
          }}
        />
        <StatsCard
          label="Sync Rate"
          value={`${getSyncRate()}/min`}
          icon="i-ph:chart-line-up-duotone"
          trend={{
            direction: 'down',
            percentage: 5,
            progress: 0.45,
          }}
        />
      </div>

      {/* History section */}
      <div className="bg-bolt-elements-background-depth-1 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Sync History</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={classNames(
                  'px-3 py-1.5 text-sm rounded-lg',
                  'bg-bolt-elements-background-depth-2',
                  'border border-bolt-elements-borderColor',
                  'text-bolt-elements-textPrimary placeholder:text-bolt-elements-textTertiary',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleExport}
              className={classNames(
                'text-bolt-elements-textSecondary transition-theme',
                'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3',
                'p-2 rounded-lg',
              )}
              title="Export History"
            >
              <div className="i-ph:download w-4 h-4" />
            </IconButton>

            <IconButton
              onClick={handleClearHistory}
              disabled={isClearing}
              className={classNames(
                'text-bolt-elements-textSecondary transition-theme',
                'hover:text-red-400',
                'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3',
                'p-2 rounded-lg',
                { 'opacity-50 cursor-not-allowed': isClearing },
              )}
              title="Clear History"
            >
              <div className={classNames('i-ph:trash w-4 h-4', { 'animate-pulse': isClearing })} />
            </IconButton>
          </div>
        </div>

        {/* History entries */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {getFilteredHistory()
              .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
              .map((entry) => (
                <HistoryEntry
                  key={entry.id}
                  entry={entry}
                  expanded={expandedEntries.has(entry.id)}
                  onToggle={() => handleToggleEntry(entry.id)}
                  formatters={{ size: formatFileSize, time: formatDistanceToNow }}
                />
              ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {(!currentSession?.history || currentSession.history.length === 0) && (
          <div className="text-center py-12">
            <div className="i-ph:clock w-12 h-12 text-bolt-elements-textTertiary mx-auto mb-4" />
            <p className="text-bolt-elements-textSecondary">No sync history yet</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-bolt-elements-borderColor">
            <IconButton
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={classNames(
                'text-bolt-elements-textSecondary transition-theme',
                'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3',
                'p-2 rounded-lg disabled:opacity-50',
              )}
            >
              <div className="i-ph:caret-left w-4 h-4" />
            </IconButton>
            <span className="text-sm text-bolt-elements-textSecondary">
              Page {page} of {totalPages}
            </span>
            <IconButton
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={classNames(
                'text-bolt-elements-textSecondary transition-theme',
                'bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3',
                'p-2 rounded-lg disabled:opacity-50',
              )}
            >
              <div className="i-ph:caret-right w-4 h-4" />
            </IconButton>
          </div>
        )}
      </div>
    </motion.div>
  );
}
