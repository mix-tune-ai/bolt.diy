# Sidebar Module

The sidebar module provides a comprehensive chat history management interface with a sliding menu, chat organization, and various chat management features.

## Files

### Menu.client.tsx

The main sidebar menu component that provides chat history management and navigation.

**Exports:**

- `Menu`: React component for the main sliding sidebar menu

**Features:**

- Sliding menu with mouse-based activation
- Current date/time display
- User profile display
- Chat search functionality
- New chat creation
- Chat history organization by date
- Settings access
- Theme switching

**Key Components:**

- `CurrentDateTime`: Displays current date and time
- Motion-based animations for smooth transitions
- Integration with chat history management
- Search filtering for chat history

### HistoryItem.tsx

Component for rendering individual chat history items with management options.

**Exports:**

- `HistoryItem`: React component for individual chat history items
- `ChatActionButton`: Reusable button component for chat actions

**Features:**

- Chat item display with truncation
- Inline chat renaming
- Chat export functionality
- Chat duplication
- Chat deletion
- Active chat highlighting
- Tooltip support for long chat names

### date-binning.ts

Utility for organizing chat history items by date categories.

**Exports:**

- `binDates`: Function to categorize chat history items by date

**Features:**

- Smart date categorization:
  - Today
  - Yesterday
  - Current week (by day name)
  - Past 30 days
  - Current year (by month)
  - Past years (by month and year)
- Sorted chat history presentation
- Type-safe date handling

## Usage

The sidebar module is typically used as part of the main application layout:

```tsx
import { Menu } from './sidebar/Menu.client';

function AppLayout() {
  return (
    <div>
      <Menu />
      {/* Other app content */}
    </div>
  );
}
```

## Key Features

1. **Chat History Management**

   - View all previous chats
   - Search through chat history
   - Export chat conversations
   - Duplicate existing chats
   - Delete chat history
   - Rename chats

2. **User Interface**

   - Sliding menu with hover activation
   - Responsive design
   - Dark/light theme support
   - Smooth animations
   - Intuitive chat organization

3. **Date Organization**

   - Smart date categorization
   - Chronological ordering
   - Clear date headers
   - Intuitive grouping

4. **User Experience**
   - Tooltips for long chat names
   - Quick access to common actions
   - Keyboard shortcut support
   - Smooth transitions
   - Intuitive hover states

## Dependencies

- `framer-motion`: For smooth animations
- `date-fns`: For date manipulation and formatting
- `@radix-ui/react-dialog`: For dialog components
- React and related hooks
- Custom hooks and utilities from the application

## Styling

The module uses a combination of:

- Utility classes (likely Tailwind/UnoCSS)
- CSS modules for component-specific styles
- CSS variables for theme support
- Responsive design patterns

## Best Practices

1. **State Management**

   - Use appropriate React hooks for state
   - Implement proper cleanup in useEffect
   - Handle loading and error states

2. **Performance**

   - Implement proper memoization
   - Use efficient date calculations
   - Optimize rendering of large lists

3. **Accessibility**

   - Provide proper ARIA labels
   - Ensure keyboard navigation
   - Support screen readers

4. **Error Handling**
   - Graceful error handling for operations
   - User-friendly error messages
   - Proper error boundaries

## Integration Points

The sidebar module integrates with several other parts of the application:

- Chat history persistence layer
- Theme system
- Navigation system
- User profile management
- Settings management
