# Hooks

This directory contains custom React hooks used throughout the application. These hooks encapsulate reusable logic related to state management, side effects, and interactions with external services.

## Available Hooks

| Hook                     | Description                                                                                                                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useConnectionStatus`    | Manages and monitors the network connection status, providing information about disconnections and latency issues. It allows acknowledging and resetting connection issues.                                                                                      |
| `useDebugStatus`         | Tracks and manages debug-related issues (warnings and errors) within the application. It provides functionality to acknowledge individual issues or all issues at once, storing acknowledged issues in local storage to prevent them from reappearing.           |
| `useEditChatDescription` | Manages the state and behavior for editing chat descriptions, offering functions to switch between edit and view modes, handle input changes, and save updates to IndexedDB and optionally to the global application state.                                      |
| `useFeatures`            | Manages feature flags, allowing the application to check for new features and mark them as viewed. Viewed features are stored in local storage to track which features have been seen by the user.                                                               |
| `useGit`                 | Provides functionality for interacting with Git repositories within a WebContainer. It allows cloning repositories, handling authentication, and reading/writing files. It uses isomorphic-git and provides a custom file system interface for the WebContainer. |
| `useLocalProviders`      | Manages local AI providers (like Ollama and LM Studio). Currently, it's a placeholder and returns an empty array of providers.                                                                                                                                   |
| `useMessageParser`       | Parses streaming messages from AI assistants, handling artifact opening/closing, and updating parsed messages in the UI. It uses a `StreamingMessageParser` to process the messages.                                                                             |
| `useNotifications`       | Manages and displays notifications, allowing the application to check for unread notifications and mark them as read. It integrates with a log store to track read status.                                                                                       |
| `usePromptEnhancer`      | Enhances user prompts using a specified AI model. It manages the state of the enhancement process and provides functions to reset the enhancer and enhance the prompt.                                                                                           |
| `useSearchFilter`        | Provides search filtering functionality for a list of chat history items. It allows specifying the fields to search and uses debouncing to improve performance.                                                                                                  |
| `useSettings`            | Manages application settings, including theme, language, notifications, and provider configurations. It uses stores to manage the settings and provides functions to update them.                                                                                |
| `useShortcuts`           | Manages keyboard shortcuts, allowing users to trigger actions using key combinations. It prevents default browser behavior for specified shortcuts and provides an event emitter for shortcut events.                                                            |
| `useSnapScroll`          | Provides smooth scrolling and snap-to-bottom functionality for scrollable areas. It handles auto-scrolling, scroll direction detection, and re-enabling auto-scroll when the user manually scrolls to the bottom.                                                |
| `useUpdateCheck`         | Checks for application updates and manages the update acknowledgment process. It stores the last acknowledged version in local storage.                                                                                                                          |
| `useViewport`            | Tracks the viewport size and provides a boolean indicating whether the viewport is considered small (less than a specified threshold).                                                                                                                           |
| `useSearchFilter`        | Provides search filtering functionality for a list of chat history items. It allows specifying the fields to search and uses debouncing to improve performance.                                                                                                  |

## Adding a New Hook

1.  Create a new file named `useYourHookName.ts` within this directory.
2.  Implement your custom hook logic.
3.  Export your hook from `index.ts`.
4.  Update this README to include your new hook in the table above.
5.  Consider adding tests for your hook in a separate `.spec.ts` file.
