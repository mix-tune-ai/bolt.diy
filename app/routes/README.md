# app/routes

This directory contains the route handlers for the Bolt application. Each file corresponds to a specific route or API endpoint.  Remix uses file-based routing, so the structure of this directory directly maps to the application's URL structure.

## Route Files

### `_index.tsx`

- **Purpose:** This is the main index route of the application, displayed when the user visits the root URL (`/`).
- **Exports:**
    - `meta`: (MetaFunction) - Provides metadata for the route (title, description).
    - `loader`: (LoaderFunction) - Fetches data for the route (currently returns an empty object).
    - `default`: (React Component) - The main React component rendered for this route. It includes the chat interface, header, and settings panel.

### `api.chat.ts`

- **Purpose:** Handles the main chat API endpoint (`/api/chat`). This is where the core logic for interacting with LLMs resides.
- **Exports:**
    - `action`: (ActionFunctionArgs) - Handles POST requests to the chat API. Processes user messages, selects context, streams responses from LLMs, and manages conversation state.
- **Internal Functions:**
    - `parseCookies`: Parses the cookie header string and returns a key-value object.
    - `chatAction`: The core logic for handling the chat action, including context selection, streaming, and error handling.

### `api.check-env-key.ts`

- **Purpose:** Checks if a specific environment variable (API key) for a given provider is set (`/api/check-env-key`).
- **Exports:**
    - `loader`: (LoaderFunction) - Checks for the existence of a provider-specific API key in the environment variables.

### `api.enhancer.ts`

- **Purpose:** Provides an API endpoint (`/api/enhancer`) to enhance user prompts using an LLM.
- **Exports:**
    - `action`: (ActionFunctionArgs) - Handles POST requests to enhance a given prompt.
- **Internal Functions:**
    - `enhancerAction`: Implements the prompt enhancement logic.

### `api.git-proxy.$.ts`

- **Purpose:** Acts as a proxy for Git requests, primarily used for interacting with the GitHub API (`/api/git-proxy/*`).
- **Exports:**
    - `action`: (ActionFunctionArgs) - Handles POST requests to the proxy.
    - `loader`: (LoaderFunctionArgs) - Handles GET requests to the proxy.
- **Internal Functions:**
    - `handleProxyRequest`: Handles the proxy logic, forwarding requests to GitHub and adding CORS headers.

### `api.health.ts`

- **Purpose:** Provides a simple health check endpoint (`/api/health`) for the application.
- **Exports:**
    - `loader`: (LoaderFunctionArgs) - Returns a 200 OK response with basic health information.

### `api.llmcall.ts`

- **Purpose:** Handles direct LLM calls without the chat interface (`/api/llmcall`). Useful for testing or specific LLM interactions.
- **Exports:**
    - `action`: (ActionFunctionArgs) - Handles POST requests for direct LLM calls.
- **Internal Functions:**
    - `getModelList`: Retrieves the list of available models from the LLM manager.
    - `llmCallAction`: Executes the LLM call based on the provided parameters.

### `api.models.$provider.ts`

- **Purpose:** A dynamic route that fetches models for a specific provider (`/api/models/[provider]`). It re-exports the loader from `api.models.ts`.
- **Exports:**
  - `loader`: Re-exports the loader function from `api.models.ts`.

### `api.models.ts`

- **Purpose:** Fetches the list of available LLM models and provider information (`/api/models`).
- **Exports:**
    - `loader`: (LoaderFunction) - Retrieves the model list and provider information, caching the provider info for efficiency.
- **Internal Functions:**
    - `getProviderInfo`: Retrieves and caches provider information.

### `api.system.app-info.ts`

- **Purpose:** Provides information about the application, including version, dependencies, and Git details (`/api/system/app-info`).
- **Exports:**
    - `action`: (ActionFunctionArgs) - Returns application information.
- **Internal Functions:**
    - `getGitInfo`: Retrieves Git information using `execSync`.
    - `formatDependencies`: Formats dependency information.
    - `getAppResponse`: Constructs the complete application information response.

### `api.system.git-info.ts`

- **Purpose:** Provides Git-related information, including local and remote (GitHub) repository details (`/api/system/git-info`).
- **Exports:**
    - `loader`: (LoaderFunction) - Returns Git information.
- **Internal Functions:**
    - `getLocalGitInfo`: Retrieves local Git information using `execSync`.
    - `getGitHubInfo`: Fetches GitHub repository information via the GitHub API.

### `api.update.ts`

- **Purpose:** Handles the application update process (`/api/update`).  This includes fetching changes from the upstream repository, installing dependencies, and building the application.
- **Exports:**
    - `action`: (ActionFunction) - Manages the update process, streaming progress updates to the client.
- **Internal Functions:**
    - `fetchChangelog`: Fetches or generates a changelog for the update.

### `chat.$id.tsx`

- **Purpose:** This route handles individual chat sessions identified by an ID (`/chat/[id]`). It reuses the main index route component.
- **Exports:**
    - `loader`: (LoaderFunctionArgs) - Loads data for a specific chat session (currently just returns the chat ID).
    - `default`: (React Component) - Reuses the `IndexRoute` component, effectively rendering the same UI as the root route.

### `git.tsx`

- **Purpose:** This route is dedicated to importing projects from a Git URL (`/git`).
- **Exports:**
    - `meta`: (MetaFunction) - Provides metadata for the route.
    - `loader`: (LoaderFunctionArgs) - Loads data related to the Git URL import (currently returns the URL).
    - `default`: (React Component) - Renders the `GitUrlImport` component, allowing users to import projects.

### `webcontainer.preview.$id.tsx`

- **Purpose:** Displays a preview of the application running within a WebContainer (`/webcontainer/preview/[id]`).
- **Exports:**
    - `loader`: (LoaderFunctionArgs) - Loads data for the preview (the preview ID).
    - `default`: (React Component) - Renders the iframe that displays the WebContainer preview.
- **Internal Functions:**
    - `handleRefresh`: Refreshes the preview iframe.
    - `notifyPreviewReady`: Notifies the parent window that the preview is ready. 