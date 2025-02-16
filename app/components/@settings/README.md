# @settings Module

The @settings module provides a comprehensive settings management system for the Bolt application, featuring a modular tab-based interface with support for both user and developer modes.

## Directory Structure

```
@settings/
├── core/
│   ├── AvatarDropdown.tsx
│   ├── ControlPanel.tsx
│   ├── constants.ts
│   ├── types.ts
│   └── index.ts
├── shared/
│   └── components/
│       ├── DraggableTabList.tsx
│       ├── TabManagement.tsx
│       └── TabTile.tsx
└── tabs/
    ├── connections/
    ├── data/
    ├── debug/
    ├── event-logs/
    ├── features/
    ├── notifications/
    ├── profile/
    ├── providers/
    ├── settings/
    ├── task-manager/
    └── update/
```

## Core Components

### ControlPanel (`core/ControlPanel.tsx`)

The main settings interface that manages tab visibility, animations, and user interactions.

#### Features

- Dynamic tab management
- Developer mode toggle
- Animated transitions
- Status indicators
- Beta feature labels
- Responsive layout
- Tab visibility control
- Window type switching (user/developer)

### Types (`core/types.ts`)

Core type definitions for the settings module.

```typescript
export type SettingCategory = 'profile' | 'file_sharing' | 'connectivity' | 'system' | 'services' | 'preferences';

export type TabType =
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'features'
  | 'data'
  | 'cloud-providers'
  | 'local-providers'
  | 'service-status'
  | 'connection'
  | 'debug'
  | 'event-logs'
  | 'update'
  | 'task-manager'
  | 'tab-management';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  timezone: string;
  // ... additional fields
}
```

### Constants (`core/constants.ts`)

Defines static configuration for tabs and UI elements.

- Tab icons
- Tab labels
- Tab descriptions
- Default configurations
- Beta feature flags

## Shared Components

### TabManagement (`shared/components/TabManagement.tsx`)

Handles tab organization and visibility settings.

#### Features

- Drag and drop reordering
- Tab visibility toggles
- Window type assignment
- Order persistence
- Reset capabilities

### TabTile (`shared/components/TabTile.tsx`)

Individual tab representation with status indicators.

#### Features

- Status badges
- Beta labels
- Icon display
- Click handlers
- Animation support

## Tab Modules

### Profile Tab

- User profile management
- Avatar settings
- Theme preferences
- Language settings

### Settings Tab

- Application preferences
- System settings
- Interface customization
- Performance options

### Notifications Tab

- Notification preferences
- Alert management
- Read/unread status
- Notification history

### Features Tab

- Feature flags
- Beta features
- Experimental options
- Feature updates

### Providers Tab

- AI provider configuration
- Model settings
- API key management
- Service status

## State Management

The module uses several stores for state management:

```typescript
interface TabWindowConfig {
  userTabs: UserTabConfig[];
  developerTabs: DevTabConfig[];
}

interface TabVisibilityConfig {
  id: TabType;
  visible: boolean;
  window: WindowType;
  order: number;
  isExtraDevTab?: boolean;
  locked?: boolean;
}
```

## Usage Example

```tsx
import { ControlPanel } from './core/ControlPanel';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return <ControlPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />;
}
```

## Best Practices

1. Tab Management

   - Keep tab order consistent
   - Preserve user preferences
   - Handle window type appropriately
   - Validate tab configurations

2. State Persistence

   - Save user preferences
   - Handle migration gracefully
   - Validate stored data
   - Provide defaults

3. Performance

   - Optimize animations
   - Lazy load tab content
   - Memoize expensive calculations
   - Handle large configurations

4. Accessibility

   - Maintain keyboard navigation
   - Provide ARIA labels
   - Support screen readers
   - Handle focus management

5. Developer Mode
   - Clear indication of mode
   - Protected features
   - Proper error handling
   - Debug information

## Dependencies

- framer-motion
- @radix-ui/react-switch
- @radix-ui/react-dialog
- @nanostores/react
- And more...

## Styling

The module uses:

- CSS Modules
- UnoCSS
- CSS Variables
- Framer Motion animations

## Events and Callbacks

- Tab selection
- Mode switching
- Profile updates
- Setting changes
- Tab reordering
- Window type changes

## Error Handling

- Invalid configurations
- Missing tab components
- State persistence errors
- API failures
- Type validation
