# Runtime Module

This module handles the runtime execution environment for Bolt, including message parsing and action execution.

## Files

### message-parser.ts

Handles parsing of streaming messages and artifacts in the application.

**Exports:**

- `interface ArtifactCallbackData`

  - `messageId`: string
  - Extends `BoltArtifactData`

- `interface ActionCallbackData`

  - `artifactId`: string
  - `messageId`: string
  - `actionId`: string
  - `action`: BoltAction

- `type ArtifactCallback = (data: ArtifactCallbackData) => void`
- `type ActionCallback = (data: ActionCallbackData) => void`

- `interface ParserCallbacks`

  - `onArtifactOpen?`: ArtifactCallback
  - `onArtifactClose?`: ArtifactCallback
  - `onActionOpen?`: ActionCallback
  - `onActionStream?`: ActionCallback
  - `onActionClose?`: ActionCallback

- `interface StreamingMessageParserOptions`

  - `callbacks?`: ParserCallbacks
  - `artifactElement?`: ElementFactory

- `class StreamingMessageParser`
  - Constructor: `(options: StreamingMessageParserOptions)`
  - Methods:
    - `parse(messageId: string, input: string)`
    - `reset()`

### action-runner.ts

Manages the execution of actions within the application.

**Exports:**

- `type ActionStatus = 'pending' | 'running' | 'complete' | 'aborted' | 'failed'`

- `type BaseActionState`

  - Extends `BoltAction`
  - `status`: Exclude<ActionStatus, 'failed'>
  - `abort`: () => void
  - `executed`: boolean
  - `abortSignal`: AbortSignal

- `type FailedActionState`

  - Extends `BoltAction` & `BaseActionState`
  - `status`: 'failed'
  - `error`: string

- `type ActionState = BaseActionState | FailedActionState`

- `type ActionStateUpdate`

  - Base update or failure update with error

- `class ActionRunner`
  Properties:

  - `runnerId`: Atom<string>
  - `actions`: ActionsMap
  - `onAlert?`: (alert: ActionAlert) => void

  Methods:

  - Constructor: `(webcontainerPromise: Promise<WebContainer>, getShellTerminal: () => BoltShell, onAlert?: (alert: ActionAlert) => void)`
  - `addAction(data: ActionCallbackData): void`
  - `runAction(data: ActionCallbackData, isStreaming?: boolean): Promise<void>`

### message-parser.spec.ts

Contains unit tests for the message parser functionality.

## Usage

The runtime module provides core functionality for:

1. Parsing streaming messages and artifacts
2. Managing and executing actions
3. Handling shell commands and file operations
4. Error handling and status management

The module is essential for the real-time execution environment of Bolt, handling both synchronous and asynchronous operations in a controlled manner.
