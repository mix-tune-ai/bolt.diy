# Bolt Application Core

The main application directory containing all core functionality, components, and modules for the Bolt IDE.

## Directory Structure

```
app/
├── components/     # UI components and feature modules
├── lib/           # Core libraries and utilities
├── routes/        # Application routes and API endpoints
├── styles/        # Global styles and theme definitions
├── types/         # TypeScript type definitions
├── utils/         # Utility functions and helpers
├── entry.client.tsx   # Client-side entry point
├── entry.server.tsx   # Server-side entry point
├── root.tsx           # Root application component
└── vite-env.d.ts     # Vite environment types
```

## Core Modules

### Components (`/components`)

Contains all UI components and feature modules. See detailed documentation in:

- [UI Components](./components/ui/README.md)
- [Chat Components](./components/chat/README.md)
- [Settings Components](./@settings/README.md)
- [Editor Components](./components/editor/README.md)
- [Workbench Components](./components/workbench/README.md)
- [Header Components](./components/header/README.md)
- [Sidebar Components](./components/sidebar/README.md)

### Libraries (`/lib`)

Core functionality and service integrations:

- [API Integration](./lib/api/README.md)
- [Common Utilities](./lib/common/README.md)
- [Hooks](./lib/hooks/README.md)
- [Modules](./lib/modules/README.md)
- [Persistence](./lib/persistence/README.md)
- [Runtime](./lib/runtime/README.md)
- [WebContainer](./lib/webcontainer/README.md)

### Routes (`/routes`)

Application routing and API endpoints:

#### Page Routes

- `_index.tsx`: Main application page
- `chat.$id.tsx`: Individual chat pages
- `git.tsx`: Git integration page
- `webcontainer.preview.$id.tsx`: WebContainer preview pages

#### API Routes

- `api.chat.ts`: Chat functionality
- `api.check-env-key.ts`: Environment key validation
- `api.enhancer.ts`: Prompt enhancement
- `api.git-proxy.$.ts`: Git proxy functionality
- `api.health.ts`: Health checks
- `api.llmcall.ts`: LLM API calls
- `api.models.ts`: Model management
- `api.system.*.ts`: System information
- `api.update.ts`: Update management

### Styles (`/styles`)

Global styling and theme configuration:

#### Core Styles

- `index.scss`: Main stylesheet
- `variables.scss`: CSS variables and theming
- `animations.scss`: Global animations
- `z-index.scss`: Z-index management

#### Component Styles

- `components/code.scss`: Code block styling
- `components/editor.scss`: Editor styling
- `components/resize-handle.scss`: Resize handler styling
- `components/terminal.scss`: Terminal styling
- `components/toast.scss`: Toast notification styling

### Types (`/types`)

TypeScript type definitions:

- `actions.ts`: Action type definitions
- `artifact.ts`: Artifact type definitions
- `context.ts`: Context type definitions
- `GitHub.ts`: GitHub integration types
- `model.ts`: Model type definitions
- `template.ts`: Template type definitions
- `terminal.ts`: Terminal type definitions
- `theme.ts`: Theme type definitions
- `global.d.ts`: Global type declarations

### Utils (`/utils`)

Utility functions and helpers:

- `buffer.ts`: Buffer utilities
- `classNames.ts`: Class name management
- `constants.ts`: Global constants
- `debounce.ts`: Debounce functionality
- `diff.ts`: Diff utilities
- `easings.ts`: Easing functions
- `fileUtils.ts`: File handling utilities
- `folderImport.ts`: Folder import utilities
- `formatSize.ts`: Size formatting
- `logger.ts`: Logging utilities
- `markdown.ts`: Markdown processing
- `mobile.ts`: Mobile device utilities
- `os.ts`: OS-specific utilities
- `path.ts`: Path manipulation
- `promises.ts`: Promise utilities
- `react.ts`: React utilities
- `sampler.ts`: Sampling utilities
- `shell.ts`: Shell utilities
- `stacktrace.ts`: Stack trace utilities
- `terminal.ts`: Terminal utilities
- `types.ts`: Utility types
- `unreachable.ts`: Unreachable code utilities

## Entry Points

### Client Entry (`entry.client.tsx`)

Client-side application initialization:

- Hydrates the application
- Sets up client-side routing
- Initializes state management
- Configures error boundaries

### Server Entry (`entry.server.tsx`)

Server-side rendering setup:

- Handles server-side rendering
- Manages request context
- Configures server-side routing
- Sets up error handling

### Root Component (`root.tsx`)

Root application component:

- Provides theme context
- Sets up global providers
- Manages layout structure
- Handles global error boundaries

## Development

### Prerequisites

- Node.js >= 18.18.0
- pnpm package manager
- TypeScript knowledge
- React/Remix experience

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
pnpm dev
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

## Best Practices

1. **Code Organization**

   - Follow module structure
   - Use appropriate directories
   - Maintain clear separation
   - Document exports
   - Follow naming conventions

2. **Type Safety**

   - Use TypeScript strictly
   - Define clear interfaces
   - Document type exports
   - Maintain type coverage
   - Handle edge cases

3. **Performance**

   - Optimize bundle size
   - Use code splitting
   - Implement caching
   - Monitor performance
   - Profile regularly

4. **Security**

   - Validate inputs
   - Sanitize outputs
   - Handle secrets properly
   - Implement CORS
   - Follow best practices

5. **Testing**
   - Write unit tests
   - Add integration tests
   - Test edge cases
   - Maintain coverage
   - Document test cases

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

## License

This project is licensed under the terms specified in [LICENSE](../LICENSE).
