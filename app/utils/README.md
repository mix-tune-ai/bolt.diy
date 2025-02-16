# Utils

This directory contains utility functions used throughout the application.

## Files

### `buffer.ts`

**Summary:** Provides a utility function for buffering events and executing a callback after a specified delay. Useful for batch processing of events.

**Exports:**

- `bufferWatchEvents<T extends unknown[]>(timeInMs: number, cb: (events: T[]) => unknown)`: Buffers events of type `T` and executes the callback `cb` with the buffered events after `timeInMs`.

### `classNames.ts`

**Summary:** A utility for conditionally joining CSS class names together. It's a simplified version of the popular `classnames` library.

**Exports:**

- `classNames(...args: ClassNamesArg[]): string`: Accepts a variable number of arguments which can be strings, objects, or arrays. Returns a single class name string.

### `constants.ts`

**Summary:** Defines constants used across the application, including working directory paths, regular expressions, default models, and starter templates.

**Exports:**

- `WORK_DIR_NAME`: The name of the working directory ("project").
- `WORK_DIR`: The full path to the working directory ("/home/project").
- `MODIFICATIONS_TAG_NAME`: A tag used to identify file modifications ("bolt_file_modifications").
- `MODEL_REGEX`: A regular expression to extract the model name from a string.
- `PROVIDER_REGEX`: A regular expression to extract the provider name from a string.
- `DEFAULT_MODEL`: The default model to use if none is specified.
- `PROMPT_COOKIE_KEY`: The key for the cached prompt cookie.
- `PROVIDER_LIST`: A list of all available LLM providers.
- `DEFAULT_PROVIDER`: The default LLM provider.
- `STARTER_TEMPLATES`: An array of starter template definitions.

### `debounce.ts`

**Summary:** Implements a standard debounce function to limit the rate at which a function can fire.

**Exports:**

- `debounce<Args extends any[]>(fn: (...args: Args) => void, delay = 100)`: Creates a debounced version of the provided function `fn` that will only execute after `delay` milliseconds have elapsed since the last invocation.

### `diff.spec.ts`

**Summary:** Contains unit tests for the `diff.ts` utility functions.

**Exports:**

- None (Test file)

### `diff.ts`

**Summary:** Provides functions for generating and processing diffs of files, including converting unified diffs to HTML for display.

**Exports:**

- `modificationsRegex`: A regular expression to match the modifications tag in a string.
- `createUnifiedDiff(fileA: string, fileB: string, originalContent: string, updatedContent: string)`: Creates a unified diff between two files.
- `extractRelativePath(filePath: string)`: Removes the working directory prefix from a file path.
- `convertModificationsToHTML(modifications: FileModifications)`: Converts file modifications (diffs and file contents) into an HTML string representation.

### `easings.ts`

**Summary:** Defines easing functions for animations.

**Exports:**

- `cubicEasingFn`: A cubic bezier easing function.

### `fileUtils.ts`

**Summary:** Contains utility functions for working with files, including reading package.json and detecting project types.

**Exports:**

- `IGNORE_PATTERNS`: An array of file patterns to ignore (similar to .gitignore).
- `generateId()`: Generates a unique ID.
- `readPackageJson(files: File[])`: Reads and parses the `package.json` file from a list of `File` objects.
- `detectProjectType(files: File[])`: Detects the project type (e.g., Node.js, Static) based on the files present.

### `folderImport.ts`

**Summary:** Provides a function for creating chat messages from a folder of files, including detecting project commands.

**Exports:**

- `createChatFromFolder(files: File[], binaryFiles: string[], folderName: string)`: Creates an array of `Message` objects from a folder, suitable for initializing a chat session.

### `formatSize.ts`

**Summary:** Formats a file size in bytes into a human-readable string (e.g., "1.2 KB").

**Exports:**

- `formatSize(bytes: number)`: Formats the given number of bytes into a human-readable string with appropriate units (B, KB, MB, GB, TB).

### `logger.ts`

**Summary:** Implements a scoped logger with different log levels (trace, debug, info, warn, error).

**Exports:**

- `DebugLevel`: Type definition for log levels.
- `Logger`: Interface for the logger.
- `createScopedLogger(scope?: string)`: Creates a logger instance with an optional scope.
- `renderLogger`: A pre-configured logger instance with the scope "Render".

### `markdown.ts`

**Summary:** Provides utilities for working with Markdown, including configuring remark and rehype plugins for sanitization and custom handling of HTML.

**Exports:**

- `allowedHTMLElements`: An array of allowed HTML elements for sanitization.
- `rehypeSanitizeOptions`: Configuration options for `rehype-sanitize`.
- `remarkPlugins(html: boolean)`: Returns an array of remark plugins based on whether HTML is enabled.
- `rehypePlugins(html: boolean)`: Returns an array of rehype plugins based on whether HTML is enabled.
- `limitedMarkdownPlugin`: A custom rehype plugin to limit Markdown rendering to basic text formatting.

### `mobile.ts`

**Summary:** Provides a utility to detect if the current device is a mobile device (based on screen width).

**Exports:**

- `isMobile()`: Returns `true` if the screen width is less than 640px (the 'sm' breakpoint), indicating a mobile device.

### `os.ts`

**Summary:** Provides helper functions to detect the user's operating system (Mac, Windows, Linux).

**Exports:**

- `isMac`: `true` if the user's operating system is macOS.
- `isWindows`: `true` if the user's operating system is Windows.
- `isLinux`: `true` if the user's operating system is Linux.

### `path.ts`

**Summary:** Provides a browser-compatible implementation of Node.js's `path` module, using `path-browserify`.

**Exports:**

- `path`: An object containing path manipulation functions (join, dirname, basename, extname, relative, isAbsolute, normalize, parse, format).

### `projectCommands.ts`

**Summary:** Deals with detecting and creating project commands (setup, start) based on file contents, and escaping/unescaping special Bolt tags.

**Exports:**

- `ProjectCommands`: Interface defining the structure of project commands.
- `detectProjectCommands(files: FileContent[])`: Analyzes file contents to determine project type and commands.
- `createCommandsMessage(commands: ProjectCommands)`: Creates a `Message` object representing project commands.
- `escapeBoltArtifactTags(input: string)`: Escapes `<bolt_file_modifications>` tags in a string.
- `escapeBoltAActionTags(input: string)`: Escapes `<boltAction>` tags in a string.
- `escapeBoltTags(input: string)`: Escapes both `<bolt_file_modifications>` and `<boltAction>` tags.

### `promises.ts`

**Summary:** Provides utility functions for working with Promises, including a `withResolvers` function similar to the native `Promise.withResolvers`.

**Exports:**

- `withResolvers<T>(): PromiseWithResolvers<T>`: Creates a Promise along with its resolve and reject functions.

### `react.ts`

**Summary:** Provides React-related utility functions, primarily for memoization.

**Exports:**

- `genericMemo`: A memoization function for React components, similar to `React.memo`.

### `sampler.ts`

**Summary:** Implements a sampling function that limits the rate of function calls, captures trailing calls, and ensures execution at regular intervals.

**Exports:**

- `createSampler<T extends (...args: any[]) => any>(fn: T, sampleInterval: number)`: Creates a sampled version of the provided function `fn` that executes at most once every `sampleInterval` milliseconds.

### `selectStarterTemplate.ts`

**Summary:** Contains logic for selecting a starter template based on user input, fetching template files from GitHub, and preparing initial chat messages.

**Exports:**

- `getTemplates(templateName: string, title?: string)`: Fetches a starter template by name, retrieves its files from GitHub, filters them based on ignore rules, and returns an object containing assistant/user messages and the file contents.
- `selectStarterTemplate(prompt: string, provider: ProviderInfo)`: Selects a starter template using an LLM call based on the provided prompt.

### `shell.ts`

**Summary:** Provides a `BoltShell` class for interacting with the WebContainer's shell, executing commands, and managing input/output streams. Also includes functions for cleaning terminal output.

**Exports:**

- `newShellProcess(webcontainer: WebContainer, terminal: ITerminal)`: Spawns a new shell process (/bin/jsh) within the WebContainer.
- `ExecutionResult`: Type definition for the result of a shell command execution.
- `BoltShell`: A class that manages shell processes and command execution within the WebContainer.
- `newBoltShellProcess()`: Creates a new instance of the `BoltShell` class.
- `cleanTerminalOutput(input: string)`: Cleans and formats terminal output by removing ANSI escape sequences, OSC sequences, and extra whitespace, while preserving essential formatting.

### `stacktrace.ts`

**Summary:** Provides a function to clean stack traces by replacing WebContainer URLs with relative paths.

**Exports:**

- `cleanStackTrace(stackTrace: string)`: Cleans a stack trace string by replacing absolute WebContainer URLs with relative paths.

### `stripIndent.ts`

**Summary:** Provides a function to strip leading indentation from strings, useful for working with multiline strings and template literals.

**Exports:**

- `stripIndents(value: string): string`: Removes leading whitespace from each line in a string.
- `stripIndents(strings: TemplateStringsArray, ...values: any[]): string`: Works as a template tag to strip indents from template literals.

### `terminal.ts`

**Summary:** Defines constants and helper functions for working with terminal output, including escape codes and colored text.

**Exports:**

- `escapeCodes`: An object containing ANSI escape codes for resetting styles and clearing the screen.
- `coloredText`: An object containing functions for applying colored text using ANSI escape codes (currently only `red`).

### `types.ts`

**Summary:** Defines TypeScript types related to Ollama models and API responses.

**Exports:**

- `OllamaModelDetails`: Interface for details of an Ollama model.
- `OllamaModel`: Interface for an Ollama model.
- `OllamaApiResponse`: Interface for the response from the Ollama API.
