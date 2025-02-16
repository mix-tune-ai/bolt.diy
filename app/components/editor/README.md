# Editor Module

The editor module provides a powerful code editing experience using CodeMirror 6 as its foundation. This module is split into two main parts: the core CodeMirror integration and the editor components.

## Directory Structure

```
editor/
├── codemirror/
│   ├── BinaryContent.tsx
│   ├── CodeMirrorEditor.tsx
│   ├── cm-theme.ts
│   ├── indent.ts
│   └── languages.ts
```

## Core Components

### CodeMirrorEditor (`codemirror/CodeMirrorEditor.tsx`)

The main editor component that integrates CodeMirror 6 with React.

#### Exports

- `EditorDocument`: Interface for document metadata

  ```typescript
  interface EditorDocument {
    value: string;
    isBinary: boolean;
    filePath: string;
    scroll?: ScrollPosition;
  }
  ```

- `EditorSettings`: Interface for editor configuration

  ```typescript
  interface EditorSettings {
    fontSize?: string;
    gutterFontSize?: string;
    tabSize?: number;
  }
  ```

- `ScrollPosition`: Interface for scroll state

  ```typescript
  interface ScrollPosition {
    top: number;
    left: number;
  }
  ```

- `EditorUpdate`: Interface for editor change events

  ```typescript
  interface EditorUpdate {
    selection: EditorSelection;
    content: string;
  }
  ```

- Callback Types:
  - `OnChangeCallback`: For content changes
  - `OnScrollCallback`: For scroll position updates
  - `OnSaveCallback`: For save operations

#### Features

- Debounced change and scroll events
- Auto-focus support
- Read-only mode with tooltips
- Document state persistence
- Theme customization
- Language-specific syntax highlighting
- Undo/redo history
- Search functionality
- Auto-completion
- Bracket matching
- Code folding
- Line numbers
- Active line highlighting

### BinaryContent (`codemirror/BinaryContent.tsx`)

A simple component that displays a message when a file cannot be displayed in the editor (binary files).

### Theme Configuration (`codemirror/cm-theme.ts`)

Manages editor theming with support for light and dark modes.

#### Exports

- `darkTheme`: Base dark theme configuration
- `themeSelection`: Theme compartment for dynamic switching
- `getTheme()`: Function to generate theme extensions
- `reconfigureTheme()`: Function to update theme configuration

#### Features

- VSCode-like theme variants
- Customizable editor appearance
- Dynamic theme switching
- Support for custom font sizes
- Selection highlighting
- Cursor customization

### Language Support (`codemirror/languages.ts`)

Provides language-specific syntax highlighting and features.

#### Supported Languages

- Vue
- TypeScript
- JavaScript
- TSX/JSX
- HTML
- CSS
- And more...

#### Features

- Lazy loading of language support
- File extension-based language detection
- Language-specific syntax highlighting
- Language-specific indentation rules

### Indentation (`codemirror/indent.ts`)

Handles code indentation behavior.

#### Features

- Tab key handling
- Multi-line indentation
- Selection-aware indentation
- Shift+Tab for unindenting
- Preserves cursor/selection state

## Usage

```tsx
import { CodeMirrorEditor } from './codemirror/CodeMirrorEditor';

function MyEditor() {
  return (
    <CodeMirrorEditor
      theme="dark"
      doc={{
        value: "console.log('Hello, World!');",
        isBinary: false,
        filePath: 'example.ts',
      }}
      settings={{
        fontSize: '14px',
        tabSize: 2,
      }}
      onChange={(update) => {
        console.log('Content changed:', update.content);
      }}
      onSave={() => {
        console.log('Save requested');
      }}
    />
  );
}
```

## Integration with Bolt

The editor module is a core part of the Bolt IDE, providing:

1. Code editing capabilities for the workbench
2. Syntax highlighting for multiple languages
3. Theme integration with the rest of the application
4. State management for open files
5. Integration with the file system
6. Support for binary file handling

## Best Practices

1. Always provide a theme prop to ensure proper styling
2. Use the settings prop to customize editor appearance
3. Implement onChange handlers for state management
4. Provide onSave handlers for file persistence
5. Use appropriate debounce values for performance
6. Consider editable prop for read-only views
7. Handle binary files appropriately

## Dependencies

- @codemirror/autocomplete
- @codemirror/commands
- @codemirror/language
- @codemirror/search
- @codemirror/state
- @codemirror/view
- @uiw/codemirror-theme-vscode
- Various language-specific packages
