import type { WebContainer } from '@webcontainer/api';
import type { PathWatcherEvent as WebContainerPathWatcherEvent } from '@webcontainer/api';
import { getEncoding } from 'istextorbinary';
import { map, type MapStore } from 'nanostores';
import { Buffer } from 'node:buffer';
import { WORK_DIR } from '~/utils/constants';
import { bufferWatchEvents } from '~/utils/buffer';
import { computeFileModifications } from '~/utils/diff';
import { createScopedLogger } from '~/utils/logger';
import ignore from 'ignore';

const logger = createScopedLogger('FilesStore');

const utf8TextDecoder = new TextDecoder('utf8', { fatal: true });

export interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
}

export interface Folder {
  type: 'folder';
}

type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;

export class FilesStore {
  #webcontainer: Promise<WebContainer>;

  /**
   * Tracks the number of files without folders.
   */
  #size = 0;

  /**
   * @note Keeps track all modified files with their original content since the last user message.
   * Needs to be reset when the user sends another message and all changes have to be submitted
   * for the model to be aware of the changes.
   */
  #modifiedFiles: Map<string, string>;

  /**
   * Map of files that matches the state of WebContainer.
   */
  files: MapStore<FileMap>;

  #ignorePatterns: ReturnType<typeof ignore> | null = null;

  get filesCount() {
    return this.#size;
  }

  constructor(webcontainer: Promise<WebContainer>) {
    this.#webcontainer = webcontainer;

    // Only access localStorage in browser environment
    let initialFiles = {};

    if (typeof window !== 'undefined') {
      const persistedFiles = localStorage.getItem('bolt-files');
      initialFiles = persistedFiles ? JSON.parse(persistedFiles) : {};
    }

    this.files = map(initialFiles);
    this.#modifiedFiles = new Map();

    // Only subscribe to storage in browser environment
    if (typeof window !== 'undefined') {
      this.files.subscribe((files) => {
        localStorage.setItem('bolt-files', JSON.stringify(files));
      });
    }

    this.#init();
  }

  getFile(filePath: string) {
    const dirent = this.files.get()[filePath];

    if (dirent?.type !== 'file') {
      return undefined;
    }

    return dirent;
  }

  getFileModifications() {
    return computeFileModifications(this.files.get(), this.#modifiedFiles);
  }

  resetFileModifications() {
    this.#modifiedFiles.clear();
  }

  setIgnorePatterns(patterns: string[]) {
    this.#ignorePatterns = ignore().add(patterns);
  }

  isFileIgnored(filePath: string): boolean {
    if (!this.#ignorePatterns) {
      return false;
    }

    return this.#ignorePatterns.ignores(filePath);
  }

  async saveFile(filePath: string, content: string) {
    if (this.isFileIgnored(filePath)) {
      logger.warn(`Attempted to save ignored file: ${filePath}`);
      throw new Error('Cannot modify ignored/protected file');
    }

    try {
      logger.info(`Attempting to save file: ${filePath}`);
      console.log('File content:', content.substring(0, 100) + '...'); // Log first 100 chars

      const webcontainer = await this.#webcontainer;
      await webcontainer.fs.writeFile(filePath, content);

      // Update the files store
      this.files.setKey(filePath, { type: 'file', content, isBinary: false });

      // Persist to localStorage
      localStorage.setItem('bolt-files', JSON.stringify(this.files.get()));
      logger.info(`Successfully saved file: ${filePath}`);

      // Log current state of files
      console.log(
        'Current files in store:',
        Object.keys(this.files.get()).map((path) => ({
          path,
          contentPreview:
            this.files.get()[path]?.type === 'file'
              ? (this.files.get()[path] as File).content.substring(0, 50) + '...'
              : '[folder]',
        })),
      );

      return true;
    } catch (error) {
      logger.error('Failed to save file\n\n', error);
      console.error('Failed to save file:', {
        filePath,
        error,
        currentFiles: Object.keys(this.files.get()),
      });
      throw error;
    }
  }

  async #init() {
    const webcontainer = await this.#webcontainer;

    webcontainer.internal.watchPaths(
      { include: [`${WORK_DIR}/**`], exclude: ['**/node_modules', '.git'], includeContent: true },
      bufferWatchEvents(100, this.#processEventBuffer.bind(this)),
    );
  }

  #processEventBuffer(events: Array<[events: WebContainerPathWatcherEvent[]]>) {
    const watchEvents = events.flat(2);

    for (const { type, path, buffer } of watchEvents) {
      const sanitizedPath = path.replace(/\/+$/g, '');

      if (this.isFileIgnored(sanitizedPath)) {
        logger.info(`Skipping ignored file: ${sanitizedPath}`);
        continue;
      }

      // Convert buffer to Buffer type if needed
      const fileBuffer = buffer ? Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength) : undefined;

      switch (type) {
        case 'add_dir': {
          this.files.setKey(sanitizedPath, { type: 'folder' });
          break;
        }
        case 'remove_dir': {
          this.files.setKey(sanitizedPath, undefined);

          // Remove all nested files/folders
          const currentFiles = this.files.get();

          for (const [path] of Object.entries(currentFiles)) {
            if (path.startsWith(sanitizedPath + '/')) {
              this.files.setKey(path, undefined);
            }
          }
          break;
        }
        case 'add_file':
        case 'change': {
          if (type === 'add_file') {
            this.#size++;
          }

          let content = '';
          const isBinary = isBinaryFile(fileBuffer);

          if (!isBinary) {
            content = this.#decodeFileContent(fileBuffer);
          }

          this.files.setKey(sanitizedPath, { type: 'file', content, isBinary });
          break;
        }
        case 'remove_file': {
          this.#size--;
          this.files.setKey(sanitizedPath, undefined);
          break;
        }
        case 'update_directory': {
          // we don't care about these events
          break;
        }
      }
    }
  }

  #decodeFileContent(buffer?: Uint8Array) {
    if (!buffer || buffer.byteLength === 0) {
      return '';
    }

    try {
      return utf8TextDecoder.decode(buffer);
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  // Add a method to debug current state
  debugState() {
    console.log('=== FilesStore Debug State ===');
    console.log('Total files:', this.#size);
    console.log('Modified files:', Array.from(this.#modifiedFiles.keys()));
    console.log('Files in store:', Object.keys(this.files.get()));
    console.log('========================');
  }
}

function isBinaryFile(buffer: Uint8Array | undefined) {
  if (buffer === undefined) {
    return false;
  }

  return getEncoding(convertToBuffer(buffer), { chunkLength: 100 }) === 'binary';
}

/**
 * Converts a `Uint8Array` into a Node.js `Buffer` by copying the prototype.
 * The goal is to  avoid expensive copies. It does create a new typed array
 * but that's generally cheap as long as it uses the same underlying
 * array buffer.
 */
function convertToBuffer(view: Uint8Array): Buffer {
  return Buffer.from(view.buffer, view.byteOffset, view.byteLength);
}
