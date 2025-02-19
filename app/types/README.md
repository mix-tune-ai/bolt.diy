# Types

This directory contains TypeScript type definitions used throughout the application.

## Files

### `GitHub.ts`

**Summary:** Defines interfaces for interacting with the GitHub API, including user data, repository information, content, branches, events, and authentication.

**Exports:**

- `GitHubUserResponse`: Represents the response from the GitHub API for a user.
- `GitHubRepoInfo`: Represents information about a GitHub repository.
- `GitHubContent`: Represents a file or directory in a GitHub repository.
- `GitHubBranch`: Represents a branch in a GitHub repository.
- `GitHubBlobResponse`: Represents the response from the GitHub API for a blob (file content).
- `GitHubOrganization`: Represents a GitHub organization.
- `GitHubEvent`: Represents a GitHub event (e.g., push, pull request).
- `GitHubLanguageStats`: Represents language statistics for a repository.
- `GitHubStats`: Represents aggregated statistics for a user or organization.
- `GitHubConnection`: Represents a connection to GitHub, including user data and token.
- `GitHubTokenInfo`: Represents information about a GitHub access token.
- `GitHubRateLimits`: Represents GitHub API rate limits.
- `GitHubAuthState`: Represents the authentication state for GitHub.
- `RepositoryStats`: Represents statistics about a local repository.

### `actions.ts`

**Summary:** Defines types related to actions that can be performed within the application, such as file operations and shell commands.

**Exports:**

- `ActionType`: A union type representing the possible types of actions ('file' or 'shell').
- `BaseAction`: A base interface for all actions, containing the action content.
- `FileAction`: Represents an action that modifies a file.
- `ShellAction`: Represents an action that executes a shell command.
- `StartAction`: Represents a start action.
- `BoltAction`: A union type of all possible action types.
- `BoltActionData`: Represents data for a Bolt action.
- `ActionAlert`: Represents an alert related to an action, including error messages.

### `artifact.ts`

**Summary:** Defines the structure for artifacts generated by the application.

**Exports:**

- `BoltArtifactData`: Represents data for a Bolt artifact, including its ID, title, and type.

### `context.ts`

**Summary:** Defines types for context annotations used in the application, such as code context and chat summaries.

**Exports:**

- `ContextAnnotation`: A union type representing different types of context annotations.
- `ProgressAnnotation`: Represents a progress update with a label, status, order, and message.

### `global.d.ts`

**Summary:** Declares global types and augments existing interfaces, such as the `Window` interface, to include Web APIs like `showDirectoryPicker` and `SpeechRecognition`.

**Exports:**

- Extends the `Window` interface.
- Extends the `Performance` interface.

### `model.ts`

**Summary:** Defines types related to LLM providers and models, including provider information and settings.

**Exports:**

- `ProviderInfo`: Represents information about an LLM provider, including its models and API access details.
- `IProviderSetting`: Represents settings for an LLM provider, such as base URL and API keys.
- `IProviderConfig`: Represents the complete configuration for an LLM provider.

### `template.ts`

**Summary:** Defines the structure for starter templates.

**Exports:**

- `Template`: Represents a starter template, including its name, description, GitHub repository, and other metadata.

### `terminal.ts`

**Summary:** Defines types for interacting with a terminal, including input/output methods.

**Exports:**

- `ITerminal`: Represents a terminal interface with methods for writing, handling data, and resetting.

### `theme.ts`

**Summary:** Defines the possible themes for the application.

**Exports:**

- `Theme`: A union type representing the available themes ('dark' or 'light').
