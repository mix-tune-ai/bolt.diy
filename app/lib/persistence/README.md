# Persistence Module

This module handles data persistence and storage functionality for the Bolt application, including chat history, local storage, and database operations.

## Files

### ChatDescription.client.tsx

Client-side component for displaying and editing chat descriptions.

**Exports:**

- `ChatDescription`: React component
  - Purpose: Renders and manages the editable chat description UI
  - Props: None
  - Uses hooks: useStore, useEditChatDescription

### db.ts

Handles IndexedDB database operations for chat history persistence.

**Exports:**

- `interface IChatMetadata`
  - `gitUrl`: string
  - `gitBranch?`: string

**Functions:**

- `openDatabase(): Promise<IDBDatabase | undefined>`
  - Opens or creates the IndexedDB database
- `getAll(db: IDBDatabase): Promise<ChatHistoryItem[]>`
  - Retrieves all chat history items
- `setMessages(db: IDBDatabase, id: string, messages: Message[], urlId?: string, description?: string, timestamp?: string, metadata?: IChatMetadata): Promise<void>`
  - Stores chat messages and metadata
- `getMessages(db: IDBDatabase, id: string): Promise<ChatHistoryItem>`
  - Retrieves messages by either ID or URL ID
- `getMessagesByUrlId(db: IDBDatabase, id: string): Promise<ChatHistoryItem>`
  - Retrieves messages using URL ID
- `getMessagesById(db: IDBDatabase, id: string): Promise<ChatHistoryItem>`
  - Retrieves messages using regular ID
- `deleteById(db: IDBDatabase, id: string): Promise<void>`
  - Deletes a chat history item
- `getNextId(db: IDBDatabase): Promise<string>`
  - Generates the next available ID
- `getUrlId(db: IDBDatabase, id: string): Promise<string>`
  - Generates a unique URL ID
- `forkChat(db: IDBDatabase, chatId: string, messageId: string): Promise<string>`
  - Creates a fork of an existing chat
- `duplicateChat(db: IDBDatabase, id: string): Promise<string>`
  - Creates a copy of an existing chat
- `createChatFromMessages(db: IDBDatabase, description: string, messages: Message[], metadata?: IChatMetadata): Promise<string>`
  - Creates a new chat from existing messages
- `updateChatDescription(db: IDBDatabase, id: string, description: string): Promise<void>`
  - Updates a chat's description
- `updateChatMetadata(db: IDBDatabase, id: string, metadata: IChatMetadata | undefined): Promise<void>`
  - Updates a chat's metadata

### localStorage.ts

Provides utilities for browser's localStorage operations.

**Exports:**

- `getLocalStorage(key: string): any | null`
  - Retrieves data from localStorage
- `setLocalStorage(key: string, value: any): void`
  - Stores data in localStorage

### useChatHistory.ts

Custom hook for managing chat history state and operations.

**Exports:**

- `interface ChatHistoryItem`

  - `id`: string
  - `urlId?`: string
  - `description?`: string
  - `messages`: Message[]
  - `timestamp`: string
  - `metadata?`: IChatMetadata

- `db`: IDBDatabase | undefined
- `chatId`: Atom<string | undefined>
- `description`: Atom<string | undefined>
- `chatMetadata`: Atom<IChatMetadata | undefined>

- `useChatHistory()`: Hook
  Returns:
  - `ready`: boolean
  - `initialMessages`: Message[]
  - `updateChatMestaData(metadata: IChatMetadata)`: Promise<void>
  - `storeMessageHistory(messages: Message[])`: Promise<void>
  - `duplicateCurrentChat(listItemId: string)`: Promise<void>
  - `importChat(description: string, messages: Message[], metadata?: IChatMetadata)`: Promise<void>
  - `exportChat(id?: string)`: Promise<void>

### document-store/

Directory containing document storage related functionality.

## Usage

The persistence module provides a complete solution for storing and managing chat history and related data in the Bolt application. It uses IndexedDB for persistent storage and provides hooks and utilities for easy integration with the React components.
