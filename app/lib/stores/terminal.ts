import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { atom, type WritableAtom } from 'nanostores';
import type { ITerminal } from '~/types/terminal';
import { newBoltShellProcess, newShellProcess } from '~/utils/shell';
import { coloredText } from '~/utils/terminal';
import { workbenchStore } from './workbench';
import { chatStore } from './chat';
import { logStore } from './logs';
import { generateId } from '~/utils/fileUtils';

const TERMINAL_ERROR_TIMEOUT = 5000; // 5 seconds
const TERMINAL_IDLE_TIMEOUT = 5000; // 5 seconds for idle detection

export class TerminalStore {
  #webcontainer: Promise<WebContainer>;
  #terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];
  #boltTerminal = newBoltShellProcess();
  #lastAIActivity = Date.now();
  #lastTerminalActivity = Date.now();
  #terminalBuffer = '';
  #monitoringTimeout: NodeJS.Timeout | null = null;
  #isProcessRunning = false;

  showTerminal: WritableAtom<boolean> = import.meta.hot?.data.showTerminal ?? atom(true);

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;

    if (import.meta.hot) {
      import.meta.hot.data.showTerminal = this.showTerminal;
    }

    // Start monitoring when terminal store is created
    this._startMonitoring();
  }

  get boltTerminal() {
    return this.#boltTerminal;
  }

  private _startMonitoring() {
    // Reset monitoring state
    this.#terminalBuffer = '';
    this.#lastAIActivity = Date.now();
    this.#lastTerminalActivity = Date.now();

    // Clear any existing monitoring timeout
    if (this.#monitoringTimeout) {
      clearTimeout(this.#monitoringTimeout);
    }

    // Set up monitoring interval
    this.#monitoringTimeout = setInterval(() => {
      this._checkTerminalState();
    }, 1000); // Check every second
  }

  private _updateTerminalActivity(data: string) {
    this.#lastTerminalActivity = Date.now();
    this.#terminalBuffer += data;

    // Check for common process start/end indicators
    if (data.includes('Starting') || data.includes('Running') || data.includes('Executing')) {
      this.#isProcessRunning = true;
    } else if (data.includes('Finished') || data.includes('Completed') || data.includes('Done') || data.includes('$')) {
      this.#isProcessRunning = false;
    }
  }

  private async _checkTerminalState() {
    const now = Date.now();
    const aiInactive = !chatStore.get().started || now - this.#lastAIActivity > TERMINAL_ERROR_TIMEOUT;
    const terminalIdle = !this.#isProcessRunning && now - this.#lastTerminalActivity > TERMINAL_IDLE_TIMEOUT;

    // Only report if we have errors or if terminal is idle (but not both)
    if (
      aiInactive &&
      ((this.#terminalBuffer.includes('error') && !terminalIdle) || // Error case
        (terminalIdle && !this.#terminalBuffer.includes('error'))) // Idle case
    ) {
      // Get the current file structure
      const files = workbenchStore.files.get();

      // Prepare the report
      const report = {
        terminalLogs: this.#terminalBuffer,
        files,
        timestamp: new Date().toISOString(),
        lastAIActivity: new Date(this.#lastAIActivity).toISOString(),
        lastTerminalActivity: new Date(this.#lastTerminalActivity).toISOString(),
        status: terminalIdle ? 'idle' : 'error',
      };

      // Log the event
      if (terminalIdle) {
        logStore.logSystem('Terminal is idle', { lastActivity: this.#lastTerminalActivity });
      } else {
        logStore.logError('Terminal error detected', new Error(this.#terminalBuffer));
      }

      // Show the terminal
      this.toggleTerminal(true);

      // Set chat as started and show workbench
      chatStore.setKey('started', true);
      workbenchStore.setShowWorkbench(true);

      // Send the report to the AI system
      const artifactId = generateId();
      workbenchStore.addArtifact({
        messageId: artifactId,
        id: artifactId,
        title: terminalIdle ? 'Terminal Idle Report' : 'Terminal Error Report',
        type: 'shell',
      });

      workbenchStore.addAction({
        messageId: artifactId,
        actionId: generateId(),
        artifactId,
        action: {
          type: 'shell',
          content: JSON.stringify(report, null, 2),
        },
      });

      // Clear the buffer after reporting
      this.#terminalBuffer = '';

      // Reset activity timestamps
      if (terminalIdle) {
        this.#lastTerminalActivity = Date.now();
      }
    }
  }

  toggleTerminal(value?: boolean) {
    this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
  }

  async attachBoltTerminal(terminal: ITerminal) {
    try {
      const wc = await this.#webcontainer;
      await this.#boltTerminal.init(wc, terminal);

      // Monitor terminal output
      terminal.onData((data) => {
        this._updateTerminalActivity(data);
        this.#lastAIActivity = Date.now();
      });
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn bolt shell\n\n') + error.message);
      return;
    }
  }

  async attachTerminal(terminal: ITerminal) {
    try {
      const shellProcess = await newShellProcess(await this.#webcontainer, terminal);
      this.#terminals.push({ terminal, process: shellProcess });

      // Monitor terminal output
      terminal.onData((data) => {
        this._updateTerminalActivity(data);
        this.#lastAIActivity = Date.now();
      });
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
      return;
    }
  }

  onTerminalResize(cols: number, rows: number) {
    for (const { process } of this.#terminals) {
      process.resize({ cols, rows });
    }
  }

  // Method to manually update AI activity timestamp
  updateAIActivity() {
    this.#lastAIActivity = Date.now();
  }

  // Method to manually clear the terminal buffer
  clearTerminalBuffer() {
    this.#terminalBuffer = '';
  }
}
