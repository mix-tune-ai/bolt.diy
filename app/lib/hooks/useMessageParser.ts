import type { Message } from 'ai';
import { useCallback, useState, useEffect } from 'react';
import { StreamingMessageParser } from '~/lib/runtime/message-parser';
import { workbenchStore } from '~/lib/stores/workbench';
import { createScopedLogger } from '~/utils/logger';
import { debounce } from '~/utils/debounce';

const logger = createScopedLogger('useMessageParser');

const PARSE_DEBOUNCE_MS = 150; // Increased debounce time
const CACHE_MAX_SIZE = 500; // Reduced cache size
const BATCH_PROCESS_DELAY = 100; // Delay between batch processing

// LRU Cache implementation for parsed messages
class LRUCache {
  private _cache: Map<string, string>;
  private _maxSize: number;
  private _processTimer?: NodeJS.Timeout;

  constructor(maxSize: number) {
    this._cache = new Map();
    this._maxSize = maxSize;
  }

  get(key: string): string | undefined {
    const value = this._cache.get(key);

    if (value !== undefined) {
      // Move to end (most recently used)
      this._cache.delete(key);
      this._cache.set(key, value);
    }

    return value;
  }

  set(key: string, value: string): void {
    // Debounce cache cleanup
    if (this._processTimer) {
      clearTimeout(this._processTimer);
    }

    this._processTimer = setTimeout(() => {
      if (this._cache.size >= this._maxSize) {
        // Remove oldest 20% of entries when cache is full
        const deleteCount = Math.floor(this._maxSize * 0.2);
        const keys = Array.from(this._cache.keys());

        for (let i = 0; i < deleteCount; i++) {
          this._cache.delete(keys[i]);
        }
      }
    }, 1000);

    this._cache.set(key, value);
  }

  clear(): void {
    if (this._processTimer) {
      clearTimeout(this._processTimer);
    }

    this._cache.clear();
  }
}

// Initialize LRU cache
const messageCache = new LRUCache(CACHE_MAX_SIZE);

// Batch processor for message parsing
class MessageBatchProcessor {
  private _queue: Array<{ message: Message; callback: (content: string) => void }> = [];
  private _processing = false;
  private _timer?: NodeJS.Timeout;

  enqueue(message: Message, callback: (content: string) => void) {
    this._queue.push({ message, callback });
    this._scheduleProcessing();
  }

  private _scheduleProcessing() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._timer = setTimeout(() => {
      this._processQueue();
    }, BATCH_PROCESS_DELAY);
  }

  private async _processQueue() {
    if (this._processing || this._queue.length === 0) {
      return;
    }

    this._processing = true;

    const currentBatch = this._queue.splice(0, 5); // Process 5 messages at a time

    for (const { message, callback } of currentBatch) {
      if (message.role === 'assistant') {
        const cacheKey = `${message.id}-${message.content}`;
        const cachedContent = messageCache.get(cacheKey);

        if (cachedContent !== undefined) {
          callback(cachedContent);
          continue;
        }

        const parsedContent = messageParser.parse(message.id, message.content);
        messageCache.set(cacheKey, parsedContent);
        callback(parsedContent);
      }
    }

    this._processing = false;

    if (this._queue.length > 0) {
      this._scheduleProcessing();
    }
  }

  clear() {
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._queue = [];
    this._processing = false;
  }
}

const batchProcessor = new MessageBatchProcessor();

const messageParser = new StreamingMessageParser({
  callbacks: {
    onArtifactOpen: (data) => {
      logger.trace('onArtifactOpen', data);
      workbenchStore.showWorkbench.set(true);
      workbenchStore.addArtifact(data);
    },
    onArtifactClose: (data) => {
      logger.trace('onArtifactClose');
      workbenchStore.updateArtifact(data, { closed: true });
    },
    onActionOpen: (data) => {
      logger.trace('onActionOpen', data.action);

      if (data.action.type === 'file') {
        workbenchStore.addAction(data);
      }
    },
    onActionClose: (data) => {
      logger.trace('onActionClose', data.action);

      if (data.action.type !== 'file') {
        workbenchStore.addAction(data);
      }

      workbenchStore.runAction(data);
    },
    onActionStream: (data) => {
      logger.trace('onActionStream', data.action);
      workbenchStore.runAction(data, true);
    },
  },
});

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<{ [key: number]: string }>({});

  // Optimized batch processing with debounce
  const parseMessages = useCallback(
    debounce((messages: Message[], isLoading: boolean) => {
      if (import.meta.env.DEV && !isLoading) {
        messageParser.reset();
        messageCache.clear();
        batchProcessor.clear();
      }

      messages.forEach((message, index) => {
        if (message.role === 'assistant') {
          batchProcessor.enqueue(message, (parsedContent) => {
            setParsedMessages((prev) => ({
              ...prev,
              [index]: parsedContent,
            }));
          });
        }
      });
    }, PARSE_DEBOUNCE_MS),
    [],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      batchProcessor.clear();
    };
  }, []);

  return { parsedMessages, parseMessages };
}
