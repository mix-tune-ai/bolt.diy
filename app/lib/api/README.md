# API Library (`app/lib/api`)

This directory contains utility functions for interacting with various APIs and managing application state related to those APIs. This includes checking connection status, parsing cookies, handling debug information, managing feature flags, processing notifications, and checking for updates.

## Files

### `connection.ts`

Provides functions for checking the network connection status.

- **`checkConnection()`:** Checks the network connection and returns the status.
  - **Returns:** `Promise<ConnectionStatus>` - An object containing `connected` (boolean), `latency` (number), and `lastChecked` (string).

### `cookies.ts`

Provides functions for parsing cookies from HTTP headers.

- **`parseCookies(cookieHeader: string | null)`:** Parses a cookie header string into a key-value object.
  - `cookieHeader`: The HTTP cookie header string.
  - **Returns:** `Record<string, string>` - An object where keys are cookie names and values are cookie values.
- **`getApiKeysFromCookie(cookieHeader: string | null)`:** Extracts API keys from a cookie header.
  - `cookieHeader`: The HTTP cookie header string.
  - **Returns:** `Record<string, string>` - An object containing the API keys.
- **`getProviderSettingsFromCookie(cookieHeader: string | null)`:** Extracts provider settings from a cookie header.
  - `cookieHeader`: The HTTP cookie header string.
  - **Returns:** `Record<string, any>` - An object containing the provider settings.

### `debug.ts`

Provides functions for retrieving and managing debug status, including warnings and errors.

- **`getDebugStatus()`:** Retrieves the current debug status, including warnings and errors.
  - **Returns:** `Promise<DebugStatus>` - An object containing arrays of `warnings` and `errors`.
- **`acknowledgeWarning(id: string)`:** Acknowledges a specific warning by its ID.
  - `id`: The ID of the warning to acknowledge.
  - **Returns:** `Promise<void>`
- **`acknowledgeError(id: string)`:** Acknowledges a specific error by its ID.
  - `id`: The ID of the error to acknowledge.
  - **Returns:** `Promise<void>`

### `features.ts`

Provides functions for managing feature flags.

- **`getFeatureFlags()`:** Retrieves a list of available feature flags.
  - **Returns:** `Promise<Feature[]>` - An array of `Feature` objects.
- **`markFeatureViewed(featureId: string)`:** Marks a feature flag as viewed.
  - `featureId`: The ID of the feature to mark as viewed.
  - **Returns:** `Promise<void>`

### `notifications.ts`

Provides functions for managing user notifications, including retrieving, marking as read, and clearing notifications.

- **`getNotifications()`:** Retrieves a list of notifications.
  - **Returns:** `Promise<Notification[]>` - An array of `Notification` objects.
- **`markNotificationRead(notificationId: string)`:** Marks a notification as read.
  - `notificationId`: The ID of the notification to mark as read.
  - **Returns:** `Promise<void>`
- **`clearNotifications()`:** Clears all notifications.
  - **Returns:** `Promise<void>`
- **`getUnreadCount()`:** Gets the number of unread notifications.
  - **Returns:** `number` - The number of unread notifications.

### `updates.ts`

Provides functions for checking for application updates.

- **`compareVersions(v1: string, v2: string)`:** Compares two version strings.
  - `v1`: The first version string.
  - `v2`: The second version string.
  - **Returns:** `number` - A negative number if v1 < v2, a positive number if v1 > v2, and 0 if v1 == v2.
- **`checkForUpdates()`:** Checks for available application updates.
  - **Returns:** `Promise<UpdateCheckResult>` - An object indicating if an update is `available`, the `version` of the update, and optional `releaseNotes`.
- **`acknowledgeUpdate(version: string)`:** Acknowledges an update, storing the acknowledged version.
  - `version`: The version string to acknowledge.
  - **Returns:** `Promise<void>`
