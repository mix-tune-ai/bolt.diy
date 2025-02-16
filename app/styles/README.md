# Styles Module

The styles module provides the global styling system for the Bolt application, including theme management, component styles, and animations.

## Directory Structure

```
styles/
├── components/
│   ├── code.scss        # Code block styling
│   ├── editor.scss      # Editor component styling
│   ├── resize-handle.scss # Resize handler styling
│   ├── terminal.scss    # Terminal component styling
│   └── toast.scss       # Toast notification styling
├── animations.scss      # Global animations
├── index.scss          # Main stylesheet
├── variables.scss      # CSS variables and theming
└── z-index.scss        # Z-index management
```

## Core Styles

### Main Stylesheet (`index.scss`)

The primary stylesheet that imports and organizes all other style modules.

```scss
@import 'variables';
@import 'animations';
@import 'z-index';
@import './components/code';
@import './components/editor';
@import './components/resize-handle';
@import './components/terminal';
@import './components/toast';

// Global styles
:root {
  @include light-theme;
}

[data-theme='dark'] {
  @include dark-theme;
}

// ... additional global styles
```

### Variables (`variables.scss`)

Defines CSS variables for theming and consistent styling.

```scss
:root {
  // Colors
  --bolt-elements-background: #ffffff;
  --bolt-elements-background-depth-1: #f5f5f5;
  --bolt-elements-background-depth-2: #e5e5e5;
  --bolt-elements-textPrimary: #1a1a1a;
  --bolt-elements-textSecondary: #666666;
  --bolt-elements-textTertiary: #999999;
  --bolt-elements-borderColor: #e0e0e0;

  // Spacing
  --bolt-spacing-1: 0.25rem;
  --bolt-spacing-2: 0.5rem;
  --bolt-spacing-3: 0.75rem;
  --bolt-spacing-4: 1rem;

  // Typography
  --bolt-font-sans: 'Inter', system-ui, sans-serif;
  --bolt-font-mono: 'JetBrains Mono', monospace;

  // ... additional variables
}
```

### Animations (`animations.scss`)

Defines global animations and transitions.

```scss
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in {
  from {
    transform: translateY(-10px);
  }
  to {
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

// ... additional animations
```

### Z-Index Management (`z-index.scss`)

Manages z-index layers for consistent stacking.

```scss
:root {
  --z-index-base: 0;
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}

// Usage classes
.z-dropdown {
  z-index: var(--z-index-dropdown);
}
.z-sticky {
  z-index: var(--z-index-sticky);
}
// ... additional z-index classes
```

## Component Styles

### Code Blocks (`components/code.scss`)

Styling for code blocks and syntax highlighting.

```scss
.code-block {
  font-family: var(--bolt-font-mono);
  background: var(--bolt-elements-background-depth-1);
  border-radius: var(--bolt-border-radius);
  padding: var(--bolt-spacing-4);

  // Syntax highlighting
  .token {
    &.comment {
      color: var(--bolt-syntax-comment);
    }
    &.string {
      color: var(--bolt-syntax-string);
    }
    &.keyword {
      color: var(--bolt-syntax-keyword);
    }
    // ... additional syntax tokens
  }
}
```

### Editor (`components/editor.scss`)

Styling for the code editor component.

```scss
.editor {
  // Base styles
  background: var(--bolt-elements-background);
  color: var(--bolt-elements-textPrimary);

  // Line numbers
  .line-numbers {
    color: var(--bolt-elements-textTertiary);
    border-right: 1px solid var(--bolt-elements-borderColor);
  }

  // Active line
  .active-line {
    background: var(--bolt-elements-background-depth-1);
  }

  // ... additional editor styles
}
```

### Resize Handle (`components/resize-handle.scss`)

Styling for resizable panel handles.

```scss
.resize-handle {
  &-horizontal {
    cursor: col-resize;
    width: 4px;

    &:hover {
      background: var(--bolt-elements-borderColor);
    }
  }

  &-vertical {
    cursor: row-resize;
    height: 4px;

    &:hover {
      background: var(--bolt-elements-borderColor);
    }
  }
}
```

### Terminal (`components/terminal.scss`)

Styling for the terminal component.

```scss
.terminal {
  font-family: var(--bolt-font-mono);
  background: var(--bolt-terminal-background);
  color: var(--bolt-terminal-text);

  // Cursor
  .terminal-cursor {
    background: var(--bolt-terminal-cursor);
  }

  // Selection
  .terminal-selection {
    background: var(--bolt-terminal-selection);
  }

  // ... additional terminal styles
}
```

### Toast Notifications (`components/toast.scss`)

Styling for toast notification components.

```scss
.toast {
  background: var(--bolt-elements-background-depth-2);
  border-radius: var(--bolt-border-radius);
  box-shadow: var(--bolt-shadow-lg);

  // Variants
  &-success {
    border-left: 4px solid var(--bolt-success);
  }

  &-error {
    border-left: 4px solid var(--bolt-error);
  }

  // ... additional toast styles
}
```

## Theme System

The application supports light and dark themes through CSS variables and theme mixins.

```scss
@mixin light-theme {
  // Light theme variables
}

@mixin dark-theme {
  // Dark theme variables
}

// Theme toggle
[data-theme='dark'] {
  @include dark-theme;
}

// System preference
@media (prefers-color-scheme: dark) {
  :root {
    @include dark-theme;
  }
}
```

## Best Practices

1. **Variable Usage**

   - Use CSS variables for theming
   - Maintain consistent naming
   - Document variable purpose
   - Group related variables
   - Provide fallbacks

2. **Component Styles**

   - Follow BEM methodology
   - Use semantic classes
   - Maintain specificity
   - Handle responsive design
   - Document complex styles

3. **Performance**

   - Minimize nesting
   - Use efficient selectors
   - Optimize animations
   - Handle vendor prefixes
   - Reduce duplicate code

4. **Maintenance**

   - Keep styles modular
   - Document changes
   - Follow conventions
   - Use preprocessor features
   - Maintain consistency

5. **Accessibility**
   - Support high contrast
   - Handle focus states
   - Provide visual cues
   - Consider color blindness
   - Test with tools

## Usage

Import styles in components:

```typescript
import '~/styles/index.scss';
import styles from './Component.module.scss';

function Component() {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
}
```

## Dependencies

- SASS/SCSS
- PostCSS
- Autoprefixer
- UnoCSS
- CSS Modules

## Build Process

Styles are processed during build:

1. SCSS compilation
2. PostCSS processing
3. Autoprefixer
4. Minification
5. Source map generation

## Contributing

When adding or modifying styles:

1. Follow existing patterns
2. Document changes
3. Test all themes
4. Check performance
5. Verify accessibility
