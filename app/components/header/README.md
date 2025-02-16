# Header Components

This module provides the main application header components, including the application logo, chat description, and action buttons.

## Files

### Header.tsx

Main header component implementation.

**Exports:**

- `Header`: React.FC
  - Main header component
  - Features:
    - Application logo display
    - Conditional chat description rendering
    - Responsive layout
    - Dark/light mode logo switching
    - Integration with chat store
  - Props: None

### HeaderActionButtons.client.tsx

Client-side action buttons for header controls.

**Exports:**

- `interface HeaderActionButtonsProps`

  - Empty interface for future extensibility

- `HeaderActionButtons`: React.FC<HeaderActionButtonsProps>
  - Features:
    - Chat visibility toggle
    - Workbench visibility toggle
    - Responsive design
    - Viewport-based adaptations
    - Disabled states management

**Internal Components:**

- `interface ButtonProps`

  - `active?`: boolean
  - `disabled?`: boolean
  - `children?`: any
  - `onClick?`: VoidFunction

- `Button`: React.FC<ButtonProps>
  - Internal button component
  - Handles:
    - Active states
    - Disabled states
    - Theme-aware styling
    - Click handlers

## Usage

The header module provides the main application header bar with:

1. Application branding
2. Navigation controls
3. Chat visibility management
4. Workbench visibility management
5. Responsive design adaptations

## Integration Points

The header components integrate with:

- Chat store for state management
- Workbench store for visibility control
- Theme system for dark/light mode
- Viewport hooks for responsive behavior
- Client-side only components for hydration management
