# Terminal Components

This module provides terminal functionality for the Bolt workbench, integrating xterm.js for terminal emulation.

## Files

### Terminal.tsx

Core terminal component implementation.

**Exports:**

- `interface TerminalRef`

  - `reloadStyles`: () => void

- `interface TerminalProps`

  - `className?`: string
  - `theme`: Theme
  - `readonly?`: boolean
  - `id`: string
  - `onTerminalReady?`: (terminal: XTerm) => void
  - `onTerminalResize?`: (cols: number, rows: number) => void

- `Terminal`: React.FC<TerminalProps>
  - Memoized and forwarded ref component
  - Features:
    - XTerm integration
    - Fit addon support
    - Web links addon support
    - Theme customization
    - Resize handling

### TerminalTabs.tsx

Terminal tab management component.

**Exports:**

- `DEFAULT_TERMINAL_SIZE`: number
- `TerminalTabs`: React.FC
  - Features:
    - Multiple terminal support (up to 3)
    - Tab switching
    - Terminal resizing
    - Theme synchronization
    - Keyboard shortcut support
    - Panel collapse/expand

### theme.ts

Terminal theming utilities.

**Exports:**

- `getTerminalTheme(overrides?: ITheme): ITheme`
  - Generates terminal theme from CSS variables
  - Supports:
    - Cursor styling
    - Color scheme
    - Selection colors
    - ANSI colors
    - Theme overrides

## Usage

The terminal module provides:

1. Interactive terminal emulation
2. Multi-terminal support
3. Theme customization
4. Resize handling
5. Keyboard shortcut integration

This module is essential for providing command-line interface capabilities within the Bolt workbench.
