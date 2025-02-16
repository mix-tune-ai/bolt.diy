# LLM Server Library (`app/lib/.server/llm`)

This directory contains server-side utilities for interacting with Large Language Models (LLMs). It includes functions for creating summaries, generating suggestions, selecting relevant context, streaming text from LLMs, and managing a switchable stream.

## Files

### `constants.ts`

Defines constants used throughout the LLM utilities.

- **`MAX_TOKENS`:** The maximum number of tokens allowed for a model.
- **`MAX_RESPONSE_SEGMENTS`:** The maximum number of model responses in a single request.
- **`IGNORE_PATTERNS`:** An array of file patterns to ignore (similar to .gitignore).
- **`File`**: Interface for file objects.
- **`Folder`**: Interface for folder objects.
- **`Dirent`**: Type alias representing either a `File` or a `Folder`.
- **`FileMap`**: Type alias for a record mapping file paths to `Dirent` objects.

### `create-summary.ts`

Provides a function for creating summaries of chat conversations.

- **`createSummary(props: { messages: Message[], env?: Env, apiKeys?: Record<string, string>, providerSettings?: Record<string, IProviderSetting>, promptId?: string, contextOptimization?: boolean, onFinish?: (resp: GenerateTextResult) => void })`:** Creates a summary of a chat conversation.
  - `props`: An object containing the input `messages`, optional server `env`, `apiKeys`, `providerSettings`, `promptId`, `contextOptimization` flag, and an optional `onFinish` callback.
  - **Returns:** `Promise<string>` - The generated summary text.

### `generate-suggestions.ts`

Provides a function for generating suggestions for the next user tasks.

- **`generateResponses(props: { messages: Message[], assistantResponse: string, env?: Env, apiKeys?: Record<string, string>, providerSettings?: Record<string, IProviderSetting>, promptId?: string, contextOptimization?: boolean, summary: string, onFinish?: (resp: GenerateTextResult) => void })`:** Generates suggestions for the next user tasks based on the conversation history and a summary.
  - `props`: An object containing the input `messages`, the last `assistantResponse`, optional server `env`, `apiKeys`, `providerSettings`, `promptId`, `contextOptimization` flag, a `summary` of the project, and an optional `onFinish` callback.
  - **Returns:** `Promise<string[]>` - An array of suggested tasks.

### `select-context.ts`

Provides functions for selecting relevant context files for LLM input.

- **`selectContext(props: { messages: Message[], env?: Env, apiKeys?: Record<string, string>, files: FileMap, providerSettings?: Record<string, IProviderSetting>, promptId?: string, contextOptimization?: boolean, summary: string, onFinish?: (resp: GenerateTextResult) => void })`:** Selects relevant files from a file map to provide as context to the LLM.
  - `props`: An object containing the input `messages`, optional server `env`, `apiKeys`, a `files` map, `providerSettings`, `promptId`, `contextOptimization` flag, a `summary` of the project, and an optional `onFinish` callback.
  - **Returns:** `Promise<FileMap>` - A filtered `FileMap` containing only the selected context files.
- **`getFilePaths(files: FileMap)`:** Gets an array of file paths from a `FileMap`, filtering out ignored patterns.
  - `files`: The `FileMap` to process.
  - **Returns:** `string[]` - An array of file paths.

### `stream-text.ts`

Provides a function for streaming text responses from an LLM.

- **`streamText(props: { messages: Omit<Message, 'id'>[], env?: Env, options?: StreamingOptions, apiKeys?: Record<string, string>, files?: FileMap, providerSettings?: Record<string, IProviderSetting>, promptId?: string, contextOptimization?: boolean, contextFiles?: FileMap, summary?: string, messageSliceId?: number })`:** Streams text from an LLM, incorporating context files and handling system prompts.
  - `props`: An object containing the input `messages`, optional server `env`, streaming `options`, `apiKeys`, a `files` map, `providerSettings`, `promptId`, `contextOptimization` flag, a `contextFiles` map, a `summary` of the project, and an optional `messageSliceId`.
  - **Returns:** `Promise<ReadableStream<any>>` - A readable stream of text chunks from the LLM.

### `switchable-stream.ts`

Provides a class for creating a transform stream that can switch between different source streams.

- **`SwitchableStream`:** A class that extends `TransformStream` to allow switching between input streams.
  - **`switchSource(newStream: ReadableStream)`:** Switches the stream to a new source stream.
    - `newStream`: The new `ReadableStream` to switch to.
  - **`close()`:** Closes the stream and cancels any active reader.
  - **`get switches()`:** Returns the number of times the stream has switched sources.

### `utils.ts`

Provides utility functions used by the LLM server library.

- **`extractPropertiesFromMessage(message: Omit<Message, 'id'>)`:** Extracts the model, provider, and cleaned content from a message.
  - `message`: The message object.
  - **Returns:** `{ model: string, provider: string, content: string }` - An object containing the extracted properties.
- **`simplifyBoltActions(input: string)`:** Simplifies `boltAction` tags in a string, specifically those with `type="file"`.
  - `input`: The input string.
  - **Returns:** `string` - The modified string with simplified `boltAction` tags.
- **`simplifyBundledArtifacts(input: string)`:** Replaces bundled `boltArtifact` tags with a placeholder.
  - `input`: The input string.
  - **Returns:**`string` - string with bundled artifacts simplified.
- **`createFilesContext(files: FileMap, useRelativePath?: boolean)`:** Creates a context string from a `FileMap`.
  - `files`: The `FileMap` to process.
  - `useRelativePath`: Optional boolean to use relative paths.
  - **Returns:** `string` - A string representing the file context.
- **`extractCurrentContext(messages: Message[])`:** Extracts `codeContext` and `summary` annotations from the last assistant message in an array of messages.
  - `messages`: The array of messages.
  - **Returns:** `{ summary?: ContextAnnotation, codeContext?: ContextAnnotation }` - An object containing the extracted context annotations.
