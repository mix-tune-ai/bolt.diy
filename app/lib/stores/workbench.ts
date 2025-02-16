import { atom, map, type MapStore, type ReadableAtom, type WritableAtom } from 'nanostores';
import type { EditorDocument, ScrollPosition } from '~/components/editor/codemirror/CodeMirrorEditor';
import { ActionRunner } from '~/lib/runtime/action-runner';
import type { ActionCallbackData, ArtifactCallbackData } from '~/lib/runtime/message-parser';
import { webcontainer } from '~/lib/webcontainer';
import type { ITerminal } from '~/types/terminal';
import { unreachable } from '~/utils/unreachable';
import { EditorStore } from './editor';
import { FilesStore, type FileMap, type File } from './files';
import { PreviewsStore } from './previews';
import { TerminalStore } from './terminal';
import JSZip from 'jszip';
import fileSaver from 'file-saver';
import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';
import { path } from '~/utils/path';
import { extractRelativePath } from '~/utils/diff';
import { description } from '~/lib/persistence';
import Cookies from 'js-cookie';
import { createSampler } from '~/utils/sampler';
import type { ActionAlert } from '~/types/actions';
import { generateId } from '~/utils/fileUtils';
import { logStore } from '~/lib/stores/logs';
import { toast } from 'react-toastify';
import type { WebContainer } from '@webcontainer/api';

// Destructure saveAs from the CommonJS module
const { saveAs } = fileSaver;

export interface ArtifactState {
  id: string;
  title: string;
  type?: string;
  closed: boolean;
  runner: ActionRunner;
}

interface FileChangeReport {
  added: string[];
  modified: string[];
  unchanged: string[];
}

export type ArtifactUpdateState = Pick<ArtifactState, 'title' | 'closed'>;

type Artifacts = MapStore<Record<string, ArtifactState>>;

export type WorkbenchViewType = 'code' | 'preview';

export class WorkbenchStore {
  #previewsStore = new PreviewsStore(webcontainer);
  #filesStore = new FilesStore(webcontainer);
  #editorStore = new EditorStore(this.#filesStore);
  #terminalStore = new TerminalStore(webcontainer);

  #reloadedMessages = new Set<string>();

  artifacts: Artifacts = import.meta.hot?.data.artifacts ?? map({});

  showWorkbench: WritableAtom<boolean> = import.meta.hot?.data.showWorkbench ?? atom(false);
  currentView: WritableAtom<WorkbenchViewType> = import.meta.hot?.data.currentView ?? atom('code');
  unsavedFiles: WritableAtom<Set<string>> = import.meta.hot?.data.unsavedFiles ?? atom(new Set<string>());
  actionAlert: WritableAtom<ActionAlert | undefined> =
    import.meta.hot?.data.unsavedFiles ?? atom<ActionAlert | undefined>(undefined);
  modifiedFiles = new Set<string>();
  artifactIdList: string[] = [];
  #globalExecutionQueue = Promise.resolve();
  constructor(_webcontainer: Promise<WebContainer>) {
    if (import.meta.hot) {
      import.meta.hot.data.artifacts = this.artifacts;
      import.meta.hot.data.unsavedFiles = this.unsavedFiles;
      import.meta.hot.data.showWorkbench = this.showWorkbench;
      import.meta.hot.data.currentView = this.currentView;
      import.meta.hot.data.actionAlert = this.actionAlert;
    }

    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const persistedState = localStorage.getItem('bolt-workbench-state');

      if (persistedState) {
        const state = JSON.parse(persistedState);
        (this.selectedFile as WritableAtom<string | undefined>).set(state.selectedFile);
        this.unsavedFiles.set(new Set(state.unsavedFiles));
      }

      // Subscribe to changes and persist them
      this.selectedFile.subscribe((file) => {
        localStorage.setItem(
          'bolt-workbench-state',
          JSON.stringify({
            selectedFile: file,
            unsavedFiles: Array.from(this.unsavedFiles.get()),
          }),
        );
      });

      this.unsavedFiles.subscribe((files) => {
        localStorage.setItem(
          'bolt-workbench-state',
          JSON.stringify({
            selectedFile: this.selectedFile.get(),
            unsavedFiles: Array.from(files),
          }),
        );
      });
    }
  }

  addToExecutionQueue(callback: () => Promise<void>) {
    this.#globalExecutionQueue = this.#globalExecutionQueue.then(() => callback());
  }

  get previews() {
    return this.#previewsStore.previews;
  }

  get files() {
    return this.#filesStore.files;
  }

  get currentDocument(): ReadableAtom<EditorDocument | undefined> {
    return this.#editorStore.currentDocument;
  }

  get selectedFile(): ReadableAtom<string | undefined> {
    return this.#editorStore.selectedFile;
  }

  get firstArtifact(): ArtifactState | undefined {
    return this.#getArtifact(this.artifactIdList[0]);
  }

  get filesCount(): number {
    return this.#filesStore.filesCount;
  }

  get showTerminal() {
    return this.#terminalStore.showTerminal;
  }
  get boltTerminal() {
    return this.#terminalStore.boltTerminal;
  }
  get alert() {
    return this.actionAlert;
  }
  clearAlert() {
    this.actionAlert.set(undefined);
  }

  toggleTerminal(value?: boolean) {
    this.#terminalStore.toggleTerminal(value);
  }

  attachTerminal(terminal: ITerminal) {
    this.#terminalStore.attachTerminal(terminal);
  }
  attachBoltTerminal(terminal: ITerminal) {
    this.#terminalStore.attachBoltTerminal(terminal);
  }

  onTerminalResize(cols: number, rows: number) {
    this.#terminalStore.onTerminalResize(cols, rows);
  }

  setDocuments(files: FileMap) {
    this.#editorStore.setDocuments(files);

    if (this.#filesStore.filesCount > 0 && this.currentDocument.get() === undefined) {
      // we find the first file and select it
      for (const [filePath, dirent] of Object.entries(files)) {
        if (dirent?.type === 'file') {
          this.setSelectedFile(filePath);
          break;
        }
      }
    }
  }

  setShowWorkbench(show: boolean) {
    this.showWorkbench.set(show);
  }

  setCurrentDocumentContent(newContent: string) {
    const filePath = this.currentDocument.get()?.filePath;

    if (!filePath) {
      return;
    }

    const originalContent = this.#filesStore.getFile(filePath)?.content;
    const unsavedChanges = originalContent !== undefined && originalContent !== newContent;

    this.#editorStore.updateFile(filePath, newContent);

    const currentDocument = this.currentDocument.get();

    if (currentDocument) {
      const previousUnsavedFiles = this.unsavedFiles.get();

      if (unsavedChanges && previousUnsavedFiles.has(currentDocument.filePath)) {
        return;
      }

      const newUnsavedFiles = new Set(previousUnsavedFiles);

      if (unsavedChanges) {
        newUnsavedFiles.add(currentDocument.filePath);
      } else {
        newUnsavedFiles.delete(currentDocument.filePath);
      }

      this.unsavedFiles.set(newUnsavedFiles);
    }
  }

  setCurrentDocumentScrollPosition(position: ScrollPosition) {
    const editorDocument = this.currentDocument.get();

    if (!editorDocument) {
      return;
    }

    const { filePath } = editorDocument;

    this.#editorStore.updateScrollPosition(filePath, position);
  }

  setSelectedFile(filePath: string | undefined) {
    this.#editorStore.setSelectedFile(filePath);
  }

  async saveFile(filePath: string) {
    const documents = this.#editorStore.documents.get();
    const document = documents[filePath];

    if (document === undefined) {
      return;
    }

    await this.#filesStore.saveFile(filePath, document.value);

    const newUnsavedFiles = new Set(this.unsavedFiles.get());
    newUnsavedFiles.delete(filePath);

    this.unsavedFiles.set(newUnsavedFiles);
  }

  async saveCurrentDocument() {
    const currentDocument = this.currentDocument.get();

    if (currentDocument === undefined) {
      return;
    }

    await this.saveFile(currentDocument.filePath);
    toast.success('File saved successfully');
  }

  resetCurrentDocument() {
    const currentDocument = this.currentDocument.get();

    if (currentDocument === undefined) {
      return;
    }

    const { filePath } = currentDocument;
    const file = this.#filesStore.getFile(filePath);

    if (!file) {
      return;
    }

    this.setCurrentDocumentContent(file.content);
  }

  async saveAllFiles() {
    for (const filePath of this.unsavedFiles.get()) {
      await this.saveFile(filePath);
    }
  }

  getFileModifcations() {
    return this.#filesStore.getFileModifications();
  }

  resetAllFileModifications() {
    this.#filesStore.resetFileModifications();
  }

  abortAllActions() {
    // TODO: what do we wanna do and how do we wanna recover from this?
  }

  setReloadedMessages(messages: string[]) {
    this.#reloadedMessages = new Set(messages);
  }

  addArtifact({ messageId, title, id, type }: ArtifactCallbackData) {
    const artifact = this.#getArtifact(messageId);

    if (artifact) {
      return;
    }

    if (!this.artifactIdList.includes(messageId)) {
      this.artifactIdList.push(messageId);
    }

    this.artifacts.setKey(messageId, {
      id,
      title,
      closed: false,
      type,
      runner: new ActionRunner(
        webcontainer,
        () => this.boltTerminal,
        (alert) => {
          if (this.#reloadedMessages.has(messageId)) {
            return;
          }

          this.actionAlert.set(alert);
        },
      ),
    });
  }

  updateArtifact({ messageId }: ArtifactCallbackData, state: Partial<ArtifactUpdateState>) {
    const artifact = this.#getArtifact(messageId);

    if (!artifact) {
      return;
    }

    this.artifacts.setKey(messageId, { ...artifact, ...state });
  }
  addAction(data: ActionCallbackData) {
    // this._addAction(data);

    this.addToExecutionQueue(() => this._addAction(data));
  }
  async _addAction(data: ActionCallbackData) {
    const { messageId } = data;

    const artifact = this.#getArtifact(messageId);

    if (!artifact) {
      unreachable('Artifact not found');
    }

    return artifact.runner.addAction(data);
  }

  runAction(data: ActionCallbackData, isStreaming: boolean = false) {
    if (isStreaming) {
      this.actionStreamSampler(data, isStreaming);
    } else {
      this.addToExecutionQueue(() => this._runAction(data, isStreaming));
    }
  }
  async _runAction(data: ActionCallbackData, isStreaming: boolean = false) {
    const { messageId } = data;

    const artifact = this.#getArtifact(messageId);

    if (!artifact) {
      unreachable('Artifact not found');
    }

    const action = artifact.runner.actions.get()[data.actionId];

    if (!action || action.executed) {
      return;
    }

    if (data.action.type === 'file') {
      const wc = await webcontainer;
      const fullPath = path.join(wc.workdir, data.action.filePath);

      if (this.selectedFile.value !== fullPath) {
        this.setSelectedFile(fullPath);
      }

      if (this.currentView.value !== 'code') {
        this.currentView.set('code');
      }

      const doc = this.#editorStore.documents.get()[fullPath];

      if (!doc) {
        await artifact.runner.runAction(data, isStreaming);
      }

      this.#editorStore.updateFile(fullPath, data.action.content);

      if (!isStreaming) {
        await artifact.runner.runAction(data);
        this.resetAllFileModifications();
      }
    } else {
      await artifact.runner.runAction(data);
    }
  }

  actionStreamSampler = createSampler(async (data: ActionCallbackData, isStreaming: boolean = false) => {
    return await this._runAction(data, isStreaming);
  }, 100); // TODO: remove this magic number to have it configurable

  #getArtifact(id: string) {
    const artifacts = this.artifacts.get();
    return artifacts[id];
  }

  async downloadZip() {
    const zip = new JSZip();
    const files = this.files.get();

    // Get the project name from the description input, or use a default name
    const projectName = (description.value ?? 'project').toLocaleLowerCase().split(' ').join('_');

    // Generate a simple 6-character hash based on the current timestamp
    const timestampHash = Date.now().toString(36).slice(-6);
    const uniqueProjectName = `${projectName}_${timestampHash}`;

    for (const [filePath, dirent] of Object.entries(files)) {
      if (dirent?.type === 'file' && !dirent.isBinary) {
        const relativePath = extractRelativePath(filePath);

        // split the path into segments
        const pathSegments = relativePath.split('/');

        // if there's more than one segment, we need to create folders
        if (pathSegments.length > 1) {
          let currentFolder = zip;

          for (let i = 0; i < pathSegments.length - 1; i++) {
            currentFolder = currentFolder.folder(pathSegments[i])!;
          }
          currentFolder.file(pathSegments[pathSegments.length - 1], dirent.content);
        } else {
          // if there's only one segment, it's a file in the root
          zip.file(relativePath, dirent.content);
        }
      }
    }

    // Generate the zip file and save it
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${uniqueProjectName}.zip`);
  }

  async pushToGitHub(
    repoName: string,
    commitMessage?: string,
    githubUsername?: string,
    ghToken?: string,
    isPrivate: boolean = false,
  ) {
    try {
      // Use cookies if username and token are not provided
      const githubToken = ghToken || Cookies.get('githubToken');
      const owner = githubUsername || Cookies.get('githubUsername');

      if (!githubToken || !owner) {
        throw new Error('GitHub token or username is not set in cookies or provided.');
      }

      // Initialize Octokit with the auth token
      const octokit = new Octokit({ auth: githubToken });

      // Check if the repository already exists before creating it
      let repo: RestEndpointMethodTypes['repos']['get']['response']['data'];

      try {
        const resp = await octokit.repos.get({ owner, repo: repoName });
        repo = resp.data;
      } catch (error) {
        if (error instanceof Error && 'status' in error && error.status === 404) {
          // Repository doesn't exist, so create a new one
          const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            private: isPrivate,
            auto_init: true,
          });
          repo = newRepo;
        } else {
          console.log('cannot create repo!');
          throw error; // Some other error occurred
        }
      }

      // Get all files
      const files = this.files.get();

      if (!files || Object.keys(files).length === 0) {
        throw new Error('No files found to push');
      }

      // Create blobs for each file
      const blobs = await Promise.all(
        Object.entries(files).map(async ([filePath, dirent]) => {
          if (dirent?.type === 'file' && dirent.content) {
            const { data: blob } = await octokit.git.createBlob({
              owner: repo.owner.login,
              repo: repo.name,
              content: Buffer.from(dirent.content).toString('base64'),
              encoding: 'base64',
            });
            return { path: extractRelativePath(filePath), sha: blob.sha };
          }

          return null;
        }),
      );

      const validBlobs = blobs.filter(Boolean); // Filter out any undefined blobs

      if (validBlobs.length === 0) {
        throw new Error('No valid files to push');
      }

      // Get the latest commit SHA (assuming main branch, update dynamically if needed)
      const { data: ref } = await octokit.git.getRef({
        owner: repo.owner.login,
        repo: repo.name,
        ref: `heads/${repo.default_branch || 'main'}`, // Handle dynamic branch
      });
      const latestCommitSha = ref.object.sha;

      // Create a new tree
      const { data: newTree } = await octokit.git.createTree({
        owner: repo.owner.login,
        repo: repo.name,
        base_tree: latestCommitSha,
        tree: validBlobs.map((blob) => ({
          path: blob!.path,
          mode: '100644',
          type: 'blob',
          sha: blob!.sha,
        })),
      });

      // Create a new commit
      const { data: newCommit } = await octokit.git.createCommit({
        owner: repo.owner.login,
        repo: repo.name,
        message: commitMessage || 'Initial commit from your app',
        tree: newTree.sha,
        parents: [latestCommitSha],
      });

      // Update the reference
      await octokit.git.updateRef({
        owner: repo.owner.login,
        repo: repo.name,
        ref: `heads/${repo.default_branch || 'main'}`, // Handle dynamic branch
        sha: newCommit.sha,
      });

      const repoUrl = repo.html_url; // Return the URL instead of showing alert
      toast.success('Successfully pushed to GitHub');

      return repoUrl;
    } catch (error) {
      console.error('Error pushing to GitHub:', error);
      toast.error('Failed to push to GitHub');
      throw error; // Rethrow the error for further handling
    }
  }

  /**
   * Force saves all files in the editor and tracks changes
   * @returns Report of file changes
   */
  async saveAllFilesFromClient(): Promise<FileChangeReport> {
    logStore.logInfo('Starting file system synchronization...', {
      operation: 'sync-start',
      type: 'file-sync',
      message: 'Starting full file system synchronization',
    });
    toast.info('Starting file system sync...');

    const files = this.files.get();
    const documents = this.#editorStore.documents.get();
    const report: FileChangeReport = {
      added: [],
      modified: [],
      unchanged: [],
    };

    // Queue for tracking all save operations
    const saveQueue: Promise<void>[] = [];

    // Add to action queue to ensure sequential processing
    this.addToExecutionQueue(async () => {
      logStore.logInfo('Processing editor documents...', {
        operation: 'sync-documents',
        type: 'file-sync',
        message: 'Processing documents currently open in editor',
      });

      // First handle documents currently loaded in editor
      for (const [filePath, document] of Object.entries(documents)) {
        if (!document) {
          continue;
        }

        // Skip ignored files
        if (this.#filesStore.isFileIgnored(filePath)) {
          logStore.logInfo(`Skipping ignored file: ${filePath}`, {
            operation: 'sync-skip-ignored',
            type: 'file-sync',
            message: `Protected file skipped: ${filePath}`,
            file: filePath,
          });
          continue;
        }

        const existingFile = this.#filesStore.getFile(filePath);
        const savePromise = this.#filesStore.saveFile(filePath, document.value).then(() => {
          if (!existingFile) {
            logStore.logInfo(`Added new file: ${filePath}`, {
              operation: 'sync-add',
              type: 'file-sync',
              message: `New file added to sync: ${filePath}`,
              file: filePath,
            });
            report.added.push(filePath);
          } else if (existingFile.content !== document.value) {
            logStore.logInfo(`Modified file: ${filePath}`, {
              operation: 'sync-modify',
              type: 'file-sync',
              message: `Modified file synced: ${filePath}`,
              file: filePath,
            });
            report.modified.push(filePath);
          } else {
            logStore.logInfo(`Checked file (unchanged): ${filePath}`, {
              operation: 'sync-check',
              type: 'file-sync',
              message: `File verified unchanged: ${filePath}`,
              file: filePath,
            });
            report.unchanged.push(filePath);
          }
        });

        saveQueue.push(savePromise);
      }

      logStore.logInfo('Processing remaining files...', {
        operation: 'sync-remaining',
        type: 'file-sync',
        message: 'Processing files not currently open in editor',
      });

      // Then handle any remaining files not loaded in editor
      for (const [filePath, dirent] of Object.entries(files)) {
        if (!dirent?.type || dirent.type !== 'file' || dirent.isBinary || documents[filePath]) {
          continue;
        }

        // Skip ignored files
        if (this.#filesStore.isFileIgnored(filePath)) {
          logStore.logInfo(`Skipping ignored file: ${filePath}`, {
            operation: 'sync-skip-ignored',
            type: 'file-sync',
            message: `Protected file skipped: ${filePath}`,
            file: filePath,
          });
          continue;
        }

        const existingFile = this.#filesStore.getFile(filePath);
        const savePromise = this.#filesStore.saveFile(filePath, dirent.content).then(() => {
          if (!existingFile) {
            logStore.logInfo(`Added new file: ${filePath}`, {
              operation: 'sync-add',
              type: 'file-sync',
              message: `New file added to sync: ${filePath}`,
              file: filePath,
            });
            report.added.push(filePath);
          } else if (existingFile.content !== dirent.content) {
            logStore.logInfo(`Modified file: ${filePath}`, {
              operation: 'sync-modify',
              type: 'file-sync',
              message: `Modified file synced: ${filePath}`,
              file: filePath,
            });
            report.modified.push(filePath);
          } else {
            logStore.logInfo(`Checked file (unchanged): ${filePath}`, {
              operation: 'sync-check',
              type: 'file-sync',
              message: `File verified unchanged: ${filePath}`,
              file: filePath,
            });
            report.unchanged.push(filePath);
          }
        });

        saveQueue.push(savePromise);
      }

      // Wait for all saves to complete
      await Promise.all(saveQueue);
      logStore.logInfo('All file operations completed', {
        operation: 'sync-complete',
        type: 'file-sync',
        message: 'All file synchronization operations completed',
      });

      // Clear tracking states
      this.unsavedFiles.set(new Set());
      this.modifiedFiles.clear();

      // Create and run a file sync action
      const syncAction: ActionCallbackData = {
        messageId: generateId(),
        artifactId: 'file-sync',
        actionId: `sync-${Date.now()}`,
        action: {
          type: 'shell',
          content: 'echo "File system synchronized"',
        },
      };

      // Add and run the sync action
      this.addAction(syncAction);
      await this.runAction(syncAction);

      // Log final summary
      const summary = [
        report.added.length ? `${report.added.length} files added` : '',
        report.modified.length ? `${report.modified.length} files modified` : '',
        report.unchanged.length ? `${report.unchanged.length} files unchanged` : '',
      ]
        .filter(Boolean)
        .join(', ');

      logStore.logInfo(`Sync complete: ${summary}`, {
        operation: 'sync-summary',
        type: 'file-sync',
        message: `File sync completed: ${summary}`,
        added: report.added.length,
        modified: report.modified.length,
        unchanged: report.unchanged.length,
      });
      toast.success(`Files synchronized: ${summary}`);
    });

    return report;
  }

  async handleFileUpload(files: FileList, targetPath?: string): Promise<void> {
    try {
      const wc = await webcontainer;
      const targetDir = targetPath || wc.workdir;
      const uploadedFiles: { content: string; path: string }[] = [];
      const binaryFiles: string[] = [];

      for (const file of Array.from(files)) {
        const filePath = path.join(targetDir, file.name);
        const relativePath = path.relative(wc.workdir, filePath);

        // Skip ignored files
        if (this.#filesStore.isFileIgnored(relativePath)) {
          logStore.logWarning('Skipping protected file', {
            operation: 'upload-skip-protected',
            type: 'file-upload',
            message: `Skipped protected file: ${file.name}`,
            file: relativePath,
          });
          toast.warning(`Skipped protected file: ${file.name}`);
          continue;
        }

        try {
          const content = await file.text();

          // Write file to WebContainer and update store
          await wc.fs.writeFile(relativePath, content);
          this.files.set({
            ...this.files.get(),
            [relativePath]: {
              content,
              type: 'file',
              isBinary: false,
            } as File,
          });

          uploadedFiles.push({ content, path: relativePath });

          logStore.logInfo('File uploaded successfully', {
            operation: 'upload-success',
            type: 'file-upload',
            message: `Successfully uploaded file: ${file.name}`,
            file: relativePath,
          });
          toast.success(`Uploaded: ${file.name}`);
        } catch {
          // If we can't read as text, it might be a binary file
          const relativePath = path.relative(wc.workdir, filePath);
          binaryFiles.push(relativePath);

          logStore.logWarning('Skipping binary file', {
            operation: 'upload-skip-binary',
            type: 'file-upload',
            message: `Skipped binary file: ${file.name}`,
            file: relativePath,
          });
          toast.warning(`Skipped binary file: ${file.name}`);
        }
      }

      if (binaryFiles.length > 0) {
        toast.info(`Skipped ${binaryFiles.length} binary files`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      logStore.logError('Failed to upload files', {
        operation: 'upload-error',
        type: 'file-upload',
        message: 'Error occurred during file upload',
        error: error instanceof Error ? error.message : String(error),
      });
      toast.error('Failed to upload files');
      throw error;
    }
  }
}

export const workbenchStore = new WorkbenchStore(webcontainer);
