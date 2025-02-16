# Chat Module

The chat module provides a sophisticated chat interface with support for multiple AI providers, real-time message streaming, file handling, and various interactive features.

## Directory Structure

```
chat/
├── chatExportAndImport/
│   ├── ExportChatButton.tsx
│   └── ImportButtons.tsx
├── APIKeyManager.tsx
├── Artifact.tsx
├── AssistantMessage.tsx
├── BaseChat.tsx
├── Chat.client.tsx
├── ChatAlert.tsx
├── CodeBlock.tsx
├── ExamplePrompts.tsx
├── FilePreview.tsx
├── GitCloneButton.tsx
├── ImportFolderButton.tsx
├── Markdown.tsx
├── Messages.client.tsx
├── ModelSelector.tsx
├── ProgressCompilation.tsx
├── ScreenshotStateManager.tsx
├── SendButton.client.tsx
├── SpeechRecognition.tsx
├── StarterTemplates.tsx
├── SupabaseAlert.tsx
├── ThoughtBox.tsx
└── UserMessage.tsx
```

## Core Components

### Chat.client.tsx

The main chat component that orchestrates the entire chat experience.

#### Features

- Real-time message streaming
- Multiple AI provider support
- File upload and handling
- Speech recognition
- Chat history management
- Message persistence
- Error handling with toast notifications
- Keyboard shortcuts
- Prompt enhancement
- Model selection
- Provider selection

### BaseChat.tsx

The foundational chat component that provides the chat interface structure.

#### Props Interface

```typescript
interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  messageRef?: RefCallback<HTMLDivElement>;
  scrollRef?: RefCallback<HTMLDivElement>;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  description?: string;
  input?: string;
  model?: string;
  provider?: ProviderInfo;
  // ... and more
}
```

#### Features

- API key management
- Model loading and configuration
- Speech recognition integration
- File upload handling
- Clipboard integration
- Progress tracking
- Alert management
- Responsive design

### Messages.client.tsx

Handles the rendering of chat messages and their interactions.

#### Features

- Message threading
- User/Assistant message differentiation
- Message actions (rewind, fork)
- Streaming indicators
- Avatar support
- Suggestion handling
- Hidden message support

## Supporting Components

### APIKeyManager.tsx

- Manages API keys for different providers
- Secure storage in cookies
- Validation and error handling

### AssistantMessage.tsx & UserMessage.tsx

- Specialized message rendering
- Markdown support
- Code block handling
- Interactive elements

### CodeBlock.tsx

- Syntax highlighting
- Copy functionality
- Language detection
- Line numbers

### ModelSelector.tsx

- Model selection interface
- Provider filtering
- Dynamic model loading
- Loading states

### FilePreview.tsx

- File preview rendering
- Image support
- Binary file handling
- File size limits

## Integration Features

### Chat Export/Import

- Chat history export
- JSON format support
- Import validation
- Error handling

### Git Integration

- Repository cloning
- Branch management
- Error handling
- Progress tracking

### Speech Recognition

- Real-time transcription
- Multiple language support
- Error handling
- Start/Stop controls

## State Management

The chat module uses several stores:

- `chatStore`: Chat state and configuration
- `workbenchStore`: File and workspace state
- `profileStore`: User profile information
- `logStore`: Logging and debugging

## Usage Example

```tsx
import { Chat } from './Chat.client';

function App() {
  return (
    <Chat
      initialMessages={[]}
      storeMessageHistory={async (messages) => {
        // Store messages
      }}
      importChat={async (description, messages) => {
        // Import chat
      }}
      exportChat={() => {
        // Export chat
      }}
    />
  );
}
```

## Best Practices

1. API Key Management

   - Store API keys securely
   - Validate keys before use
   - Handle expired keys gracefully

2. Message Handling

   - Implement proper error handling
   - Use debouncing for real-time features
   - Handle large message histories efficiently

3. File Operations

   - Validate file types and sizes
   - Handle upload errors gracefully
   - Clean up temporary files

4. Performance

   - Implement virtualization for long chats
   - Optimize re-renders
   - Use proper loading states

5. Accessibility
   - Maintain keyboard navigation
   - Provide proper ARIA labels
   - Support screen readers

## Dependencies

- @nanostores/react
- ai
- framer-motion
- react-toastify
- js-cookie
- @radix-ui/react-tooltip
- And more...

## Styling

The module uses a combination of:

- CSS Modules
- UnoCSS utility classes
- CSS Variables for theming
- Responsive design patterns

## Error Handling

- Toast notifications for user feedback
- Proper error boundaries
- Graceful degradation
- Detailed error logging

## Events and Callbacks

- Message streaming
- File uploads
- Model changes
- Provider changes
- Chat imports/exports
- Speech recognition
- Keyboard shortcuts
