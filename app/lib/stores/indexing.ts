import { map } from 'nanostores';
import { webcontainer } from '~/lib/webcontainer';
import { toast } from 'sonner';
import { workbenchStore } from './workbench';
import { generateId } from '~/utils/fileUtils';
import { TerminalStore } from './terminal';
import type { ITerminal } from '~/types/terminal';
import { chatStore } from '~/lib/stores/chat';

export interface IndexedFile {
  path: string;
  content: string;
  lastModified: number;
}

export interface IndexingState {
  isIndexing: boolean;
  lastIndexed: number | null;
  progress: number;
  error: string | null;
}

export class IndexingStore {
  private _store = map<IndexingState>({
    isIndexing: false,
    lastIndexed: null,
    progress: 0,
    error: null,
  });

  indexedFiles = map<Record<string, IndexedFile>>({});
  private _terminalStore: TerminalStore | null = null;

  get state() {
    return this._store;
  }

  async indexCodebase(): Promise<void> {
    try {
      this._store.set({
        isIndexing: true,
        error: null,
        progress: 0,
        lastIndexed: Date.now(),
      });

      // Initialize terminal if needed
      if (!this._terminalStore) {
        this._terminalStore = new TerminalStore(webcontainer);
      }

      // Create a virtual terminal for output
      const virtualTerminal: ITerminal = {
        cols: 80,
        rows: 24,
        write: (data: string) => {
          if (this._terminalStore) {
            this._terminalStore.boltTerminal.terminal?.write(data);
          }
        },
        onData: () => {},
        reset: () => {},
        input: () => {},
      };

      // Attach terminal
      await this._terminalStore.attachBoltTerminal(virtualTerminal);

      // Write to terminal
      virtualTerminal.write('Starting codebase indexing...\n');

      // Execute file discovery command
      const wc = await webcontainer;
      const process = await wc.spawn('sh', [
        '-c',
        'ls -la && find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.html"',
      ]);

      const reader = process.output.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        virtualTerminal.write(value);
      }

      // Get all files from workbench
      const files = workbenchStore.files.get();
      const totalFiles = Object.keys(files).length;
      let processedFiles = 0;

      const newIndexedFiles: Record<string, IndexedFile> = {};

      for (const [filePath, dirent] of Object.entries(files)) {
        if (dirent?.type === 'file' && !dirent.isBinary) {
          const relativePath = filePath;

          newIndexedFiles[relativePath] = {
            path: relativePath,
            content: dirent.content,
            lastModified: Date.now(),
          };

          processedFiles++;
          this._store.set({
            ...this._store.get(),
            progress: (processedFiles / totalFiles) * 100,
          });
        }
      }

      this.indexedFiles.set(newIndexedFiles);

      // Create file list for message
      const fileList = Object.values(newIndexedFiles)
        .map((file) => `${file.path}: ${file.content.slice(0, 100)}...`)
        .join('\n');

      // Send message through chat API
      const messageId = generateId();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              id: messageId,
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `[Model: gpt-4]\n\n[Provider: OpenAI]\n\nPlease analyze these indexed files:\n\n${fileList}`,
                },
              ],
            },
          ],
          files: newIndexedFiles,
          contextOptimization: true,
          isPromptCachingEnabled: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send indexed files message');
      }

      // Write completion message to terminal
      const completionMessage = `Codebase indexing complete. Indexed ${processedFiles} files.`;
      virtualTerminal.write(`\n${completionMessage}\n`);

      // Update store state
      this._store.set({
        isIndexing: false,
        error: null,
        progress: 100,
        lastIndexed: Date.now(),
      });

      // Update chat state to show chat
      chatStore.set({
        ...chatStore.get(),
        started: true,
        showChat: true,
      });

      toast.success(completionMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update store state
      this._store.set({
        isIndexing: false,
        error: errorMessage,
        progress: 0,
        lastIndexed: Date.now(),
      });

      // Write error to terminal
      if (this._terminalStore) {
        this._terminalStore.boltTerminal.terminal?.write(`\nError indexing codebase: ${errorMessage}\n`);
      }

      toast.error(`Failed to index codebase: ${errorMessage}`);
    }
  }

  getIndexedFile(filePath: string): IndexedFile | undefined {
    return this.indexedFiles.get()[filePath];
  }

  getAllIndexedFiles(): Record<string, IndexedFile> {
    return this.indexedFiles.get();
  }

  clearIndex() {
    this.indexedFiles.set({});
    this._store.set({
      isIndexing: false,
      lastIndexed: null,
      progress: 0,
      error: null,
    });
  }
}

export const indexingStore = new IndexingStore();
