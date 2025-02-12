import { vi, beforeEach } from 'vitest';

// Mock localStorage with minimal, essential methods
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Simplified IDBRequest mock for testing IndexedDB interactions
class MockIDBRequest implements Partial<IDBRequest> {
  result: any = null;
  error: DOMException | null = null;
  readyState: IDBRequestReadyState = 'pending';

  // Basic event target methods
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn().mockReturnValue(true);
}

// Simplified IDBDatabase mock for object store simulation
class MockIDBDatabase {
  objectStoreNames: string[] = [];
  version = 1;

  // Simplified object store creation with mock methods
  createObjectStore(name: string) {
    this.objectStoreNames.push(name);
    return {
      put: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
    };
  }
}

// Mock IndexedDB with simplified open method
const indexedDBMock = {
  open: vi.fn().mockImplementation(() => {
    const request = new MockIDBRequest();

    // Simulate async database opening
    setTimeout(() => {
      const db = new MockIDBDatabase();
      request.result = db;
      request.readyState = 'done';
      request.dispatchEvent(new Event('success'));
    }, 0);

    return request;
  }),
  deleteDatabase: vi.fn(),
};

// Set up global mocks for localStorage and IndexedDB
Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'indexedDB', { value: indexedDBMock });

// Reset all mocks before each test to ensure clean state
beforeEach(() => {
  vi.clearAllMocks();
});
