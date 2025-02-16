# Workbench Components

This module provides the main development workspace components for the Bolt application, including file management, code editing, and preview functionality.

## Files

### FileTree.tsx

File system navigation component.

**Exports:**

- `interface Props`

  - `files?`: FileMap
  - `selectedFile?`: string
  - `onFileSelect?`: (filePath: string) => void
  - `rootFolder?`: string
  - `hideRoot?`: boolean
  - `collapsed?`: boolean
  - `allowFolderSelection?`: boolean
  - `hiddenFiles?`: Array<string | RegExp>
  - `unsavedFiles?`: Set<string>
  - `className?`: string

- `FileTree`: React.FC<Props>
  - Memoized component for rendering file system structure
  - Features:
    - File/folder navigation
    - Selection handling
    - Collapsible folders
    - Context menu actions
    - File upload support

### Workbench.client.tsx

Main workbench container component.

**Exports:**

- `interface WorkspaceProps`

  - `chatStarted?`: boolean
  - `isStreaming?`: boolean

- `Workbench`: React.FC<WorkspaceProps>
  - Features:
    - Code/Preview view switching
    - File syncing
    - Terminal toggle
    - GitHub integration
    - File management
    - Editor integration

### EditorPanel.tsx

Code editor panel component.

**Exports:**

- Component for code editing functionality
- Integrates with CodeMirror
- Handles file selection and editing

### Preview.tsx

Preview panel component.

**Exports:**

- Component for previewing web applications
- Handles preview rendering and updates

### FileBreadcrumb.tsx

File path navigation component.

**Exports:**

- Component for displaying current file path
- Provides navigation through path segments

### PortDropdown.tsx

Port selection component.

**Exports:**

- Component for managing preview ports
- Handles port selection and switching

### ScreenshotSelector.tsx

Screenshot capture component.

**Exports:**

- Component for capturing and managing screenshots
- Handles screenshot selection and preview

### terminal/

Directory containing terminal-related components.

## Usage

The workbench module provides:

1. Integrated development environment
2. File system management
3. Code editing capabilities
4. Preview functionality
5. Terminal integration
6. GitHub integration

This module is central to Bolt's development environment, providing all necessary tools for code editing and project management.
