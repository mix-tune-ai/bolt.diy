import { useStore } from '@nanostores/react';
import { workbenchStore } from '~/lib/stores/workbench';
import { syncHistoryStore, clearSyncHistory } from '~/lib/stores/sync';
import type { SyncSession, TimeRange } from '~/types/sync';
import { useEffect, useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import StatsCard from '~/components/@settings/tabs/sync/ui/StatsCard';
import TimeRangeSelector from '~/components/@settings/tabs/sync/ui/TimeRangeSelector';
import HistoryEntry from '~/components/@settings/tabs/sync/SyncStats/components/HistoryEntry';

const timeRangeOptions = [
  { value: '24h' as TimeRange, label: 'Last 24h' },
  { value: '7d' as TimeRange, label: 'Last 7d' },
  { value: '30d' as TimeRange, label: 'Last 30d' },
  { value: 'all' as TimeRange, label: 'All time' },
];

const ITEMS_PER_PAGE = 10;

export default function SyncStats() {
  const currentSession = useStore(workbenchStore.currentSession);
  const syncHistory = useStore(syncHistoryStore);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('all');
  const [isClearing, setIsClearing] = useState(false);
  const [page, setPage] = useState(1);

  // Reset page when time range changes
  useEffect(() => {
    setPage(1);
  }, [selectedTimeRange]);

  const handleClearHistory = useCallback(async () => {
    if (isClearing) {
      return;
    }

    if (confirm('Are you sure you want to clear all sync history? This cannot be undone.')) {
      try {
        setIsClearing(true);
        clearSyncHistory();
        setExpandedEntries(new Set());

        if (currentSession) {
          const clearedSession: SyncSession = {
            ...currentSession,
            id: currentSession.id,
            timestamp: currentSession.timestamp,
            history: [],
            statistics: [],
            files: new Set(),
          };
          await workbenchStore.currentSession.set(clearedSession);
        }

        toast.success('Sync history cleared');
      } catch (error) {
        console.error('Failed to clear sync history:', error);
        toast.error('Failed to clear sync history');
      } finally {
        setIsClearing(false);
      }
    }
  }, [currentSession, isClearing]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }, []);

  const getFilteredHistory = useCallback(() => {
    const now = Date.now();

    return syncHistory.filter((entry) => {
      switch (selectedTimeRange) {
        case '24h':
          return now - entry.timestamp < 24 * 60 * 60 * 1000;
        case '7d':
          return now - entry.timestamp < 7 * 24 * 60 * 60 * 1000;
        case '30d':
          return now - entry.timestamp < 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  }, [syncHistory, selectedTimeRange]);

  const filteredHistory = getFilteredHistory();
  const totalSyncs = filteredHistory.length;
  const totalFilesSynced = filteredHistory.reduce((sum, entry) => sum + entry.statistics.totalFiles, 0);
  const totalDataSynced = filteredHistory.reduce((sum, entry) => sum + entry.statistics.totalSize, 0);
  const averageDuration =
    totalSyncs > 0 ? filteredHistory.reduce((sum, entry) => sum + entry.statistics.duration, 0) / totalSyncs / 1000 : 0;

  const getTrends = useCallback(() => {
    const currentPeriod = filteredHistory.slice(0, Math.floor(filteredHistory.length / 2));
    const previousPeriod = filteredHistory.slice(Math.floor(filteredHistory.length / 2));

    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) {
        return undefined;
      }

      const change = ((current - previous) / previous) * 100;
      const value = Math.abs(Math.round(change));

      return {
        value,
        label: `${value}% ${change >= 0 ? 'increase' : 'decrease'}`,
      };
    };

    return {
      syncs: calculateTrend(currentPeriod.length, previousPeriod.length),
      files: calculateTrend(
        currentPeriod.reduce((sum, entry) => sum + entry.statistics.totalFiles, 0),
        previousPeriod.reduce((sum, entry) => sum + entry.statistics.totalFiles, 0),
      ),
      data: calculateTrend(
        currentPeriod.reduce((sum, entry) => sum + entry.statistics.totalSize, 0),
        previousPeriod.reduce((sum, entry) => sum + entry.statistics.totalSize, 0),
      ),
      duration: calculateTrend(
        currentPeriod.reduce((sum, entry) => sum + entry.statistics.duration, 0) / currentPeriod.length,
        previousPeriod.reduce((sum, entry) => sum + entry.statistics.duration, 0) / previousPeriod.length,
      ),
    };
  }, [filteredHistory]);

  const trends = getTrends();

  if (!syncHistory.length) {
    return (
      <div className="bg-bolt-elements-background-depth-1 p-6 rounded-lg text-center">
        <div className="i-ph:cloud-slash text-4xl text-gray-400 mx-auto mb-4" />
        <div className="text-lg font-medium mb-2">No Sync History</div>
        <div className="text-sm text-gray-400">Start syncing your files to see statistics here</div>
      </div>
    );
  }

  const paginatedHistory = filteredHistory.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Sync History</h3>
          <TimeRangeSelector
            value={selectedTimeRange}
            onChange={(value: TimeRange) => setSelectedTimeRange(value)}
            options={timeRangeOptions}
          />
        </div>
        <IconButton
          onClick={handleClearHistory}
          disabled={isClearing}
          className={classNames('text-bolt-elements-textSecondary hover:text-red-400 transition-colors', {
            'opacity-50 cursor-not-allowed': isClearing,
          })}
          title="Clear History"
        >
          <div className={classNames('i-ph:trash', { 'animate-pulse': isClearing })} />
        </IconButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard icon="i-ph:list-numbers" label="Total Syncs" value={totalSyncs} _color="blue" trend={trends.syncs} />
        <StatsCard
          icon="i-ph:files"
          label="Files Synced"
          value={totalFilesSynced}
          _color="purple"
          trend={trends.files}
        />
        <StatsCard
          icon="i-ph:database"
          label="Data Synced"
          value={formatFileSize(totalDataSynced)}
          _color="green"
          trend={trends.data}
        />
        <StatsCard
          icon="i-ph:timer"
          label="Average Duration"
          value={`${averageDuration.toFixed(1)}s`}
          _color="orange"
          trend={trends.duration}
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bolt-elements-borderColor scrollbar-track-transparent">
        {paginatedHistory.map((entry) => (
          <HistoryEntry
            key={entry.id}
            entry={entry}
            expanded={expandedEntries.has(entry.id)}
            onToggle={() => toggleExpand(entry.id)}
            formatters={{
              size: formatFileSize,
              time: (date: number | Date) =>
                formatDistanceToNow(typeof date === 'number' ? date : date.getTime(), { addSuffix: true }),
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <IconButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-bolt-elements-textSecondary disabled:opacity-50"
          >
            <div className="i-ph:caret-left" />
          </IconButton>
          <span className="text-sm text-bolt-elements-textSecondary">
            Page {page} of {totalPages}
          </span>
          <IconButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-bolt-elements-textSecondary disabled:opacity-50"
          >
            <div className="i-ph:caret-right" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
