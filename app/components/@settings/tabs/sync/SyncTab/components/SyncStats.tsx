import { IconButton } from '~/components/ui/IconButton';
import TimeRangeSelector from '~/components/@settings/tabs/sync/ui/TimeRangeSelector';
import type { TimeRange, SyncHistoryEntry } from '~/types/sync';
import { formatFileSize, formatRelativeTime } from '~/lib/utils/format';

const timeRangeOptions: Array<{ value: TimeRange; label: string }> = [
  { value: '1h', label: 'Last 1h' },
  { value: '24h', label: 'Last 24h' },
  { value: '7d', label: 'Last 7d' },
  { value: '30d', label: 'Last 30d' },
  { value: 'all', label: 'All time' },
];

interface SyncStatsProps {
  history: SyncHistoryEntry[];
  selectedTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onClearHistory: () => void;
  isClearing: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function SyncStats({
  history,
  selectedTimeRange,
  onTimeRangeChange,
  onClearHistory,
  isClearing,
  currentPage,
  totalPages,
  onPageChange,
}: SyncStatsProps) {
  if (!history.length) {
    return (
      <div className="bg-bolt-elements-background-depth-1 p-6 rounded-lg text-center">
        <div className="i-ph:cloud-slash text-4xl text-gray-400 mx-auto mb-4" />
        <div className="text-lg font-medium mb-2">No Sync History</div>
        <div className="text-sm text-gray-400">Start syncing your files to see statistics here</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary">Sync History</h3>
          <TimeRangeSelector value={selectedTimeRange} onChange={onTimeRangeChange} options={timeRangeOptions} />
        </div>
        <IconButton
          onClick={onClearHistory}
          disabled={isClearing}
          className="text-bolt-elements-textSecondary hover:text-red-400 transition-colors disabled:opacity-50"
          title="Clear History"
        >
          <div className={`i-ph:trash ${isClearing ? 'animate-pulse' : ''}`} />
        </IconButton>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bolt-elements-borderColor scrollbar-track-transparent">
        {history.map((entry) => (
          <div key={entry.id} className="bg-bolt-elements-background-depth-1 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-bolt-elements-textPrimary">{entry.projectName}</div>
              <div className="text-sm text-bolt-elements-textSecondary">{formatRelativeTime(entry.timestamp)}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-bolt-elements-textSecondary">Files</div>
                <div className="text-bolt-elements-textPrimary">{entry.statistics.totalFiles}</div>
              </div>
              <div>
                <div className="text-bolt-elements-textSecondary">Size</div>
                <div className="text-bolt-elements-textPrimary">{formatFileSize(entry.statistics.totalSize)}</div>
              </div>
              <div>
                <div className="text-bolt-elements-textSecondary">Duration</div>
                <div className="text-bolt-elements-textPrimary">{(entry.statistics.duration / 1000).toFixed(1)}s</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <IconButton
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="text-bolt-elements-textSecondary disabled:opacity-50"
          >
            <div className="i-ph:caret-left" />
          </IconButton>
          <span className="text-sm text-bolt-elements-textSecondary">
            Page {currentPage} of {totalPages}
          </span>
          <IconButton
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="text-bolt-elements-textSecondary disabled:opacity-50"
          >
            <div className="i-ph:caret-right" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
