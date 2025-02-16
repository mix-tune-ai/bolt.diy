# WebContainer Module

This module manages the WebContainer integration for Bolt, providing containerized web development environments.

## Files

### index.ts

Main WebContainer initialization and configuration file.

**Exports:**

- `interface WebContainerContext`

  - `loaded`: boolean

- `webcontainerContext`: WebContainerContext

  - Manages the loading state of the WebContainer

- `webcontainer`: Promise<WebContainer>
  - Promise that resolves to the WebContainer instance
  - Configures WebContainer with:
    - COEP: 'credentialless'
    - Custom work directory
    - Preview error forwarding
  - Handles preview error messages:
    - Uncaught exceptions
    - Unhandled promise rejections
  - Integrates with workbench store for error alerts

### auth.client.ts

Client-side authentication module for WebContainer.

**Exports:**

- `auth`: Re-export from '@webcontainer/api'
- `type AuthAPI`: Re-export from '@webcontainer/api'

## Usage

The WebContainer module provides:

1. Isolated development environment setup
2. Preview error handling and reporting
3. Authentication integration
4. Hot module replacement support

This module is crucial for providing a secure and isolated development environment within the browser.
