import { useMemo } from 'react';
import StatsCard from '~/components/@settings/tabs/sync/ui/StatsCard';
import type { SyncHistoryEntry } from '~/types/sync';

interface StatsSummaryProps {
  filteredHistory: SyncHistoryEntry[];
  formatFileSize: (bytes: number) => string;
  trends: {
    syncs?: { value: number; label: string };
    files?: { value: number; label: string };
    data?: { value: number; label: string };
    duration?: { value: number; label: string };
  };
}

export default function StatsSummary({ filteredHistory, formatFileSize, trends }: StatsSummaryProps) {
  const { totalSyncs, totalFilesSynced, totalDataSynced, averageDuration } = useMemo(() => {
    const totalSyncs = filteredHistory.length;
    const totalFilesSynced = filteredHistory.reduce((sum, entry) => sum + entry.statistics.totalFiles, 0);
    const totalDataSynced = filteredHistory.reduce((sum, entry) => sum + entry.statistics.totalSize, 0);
    const averageDuration =
      totalSyncs > 0
        ? filteredHistory.reduce((sum, entry) => sum + entry.statistics.duration, 0) / totalSyncs / 1000
        : 0;

    return { totalSyncs, totalFilesSynced, totalDataSynced, averageDuration };
  }, [filteredHistory]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatsCard icon="i-ph:list-numbers" label="Total Syncs" value={totalSyncs} _color="blue" trend={trends.syncs} />
      <StatsCard icon="i-ph:files" label="Files Synced" value={totalFilesSynced} _color="purple" trend={trends.files} />
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
  );
}
