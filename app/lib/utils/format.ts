/**
 * Formats a file size in bytes to a human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Formats a timestamp to a relative time string (e.g. "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const timeDiff = Date.now() - timestamp;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}
