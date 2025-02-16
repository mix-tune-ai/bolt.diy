# Providers Module

This module manages the configuration and status of various AI providers in the Bolt application, including both cloud and local providers.

## Directory Structure

```
providers/
├── cloud/
│   └── CloudProvidersTab.tsx
├── local/
│   ├── LocalProvidersTab.tsx
│   └── OllamaModelInstaller.tsx
└── service-status/
    ├── providers/
    │   ├── amazon-bedrock.ts
    │   ├── anthropic.ts
    │   ├── cohere.ts
    │   ├── deepseek.ts
    │   ├── google.ts
    │   ├── groq.ts
    │   ├── huggingface.ts
    │   ├── hyperbolic.ts
    │   ├── mistral.ts
    │   ├── openai.ts
    │   ├── openrouter.ts
    │   ├── perplexity.ts
    │   ├── together.ts
    │   └── xai.ts
    ├── ServiceStatusTab.tsx
    ├── base-provider.ts
    ├── provider-factory.ts
    └── types.ts
```

## Core Components

### Cloud Providers (`cloud/CloudProvidersTab.tsx`)

Manages cloud-based AI provider configurations.

**Exports:**

- `CloudProvidersTab`: React component
  - Props: None
  - Features:
    - API key management
    - Provider configuration
    - Model selection
    - Connection testing

### Local Providers (`local/`)

#### LocalProvidersTab.tsx

Manages locally hosted AI providers.

**Exports:**

- `LocalProvidersTab`: React component
  - Props: None
  - Features:
    - Local model management
    - Provider configuration
    - Installation status
    - Resource monitoring

#### OllamaModelInstaller.tsx

Handles Ollama model installation and management.

**Exports:**

- `OllamaModelInstaller`: React component
  - Props:
    - `onInstallComplete`: () => void
    - `modelId`: string
  - Features:
    - Model installation
    - Progress tracking
    - Error handling
    - Version management

### Service Status (`service-status/`)

#### ServiceStatusTab.tsx

Monitors provider service health and status.

**Exports:**

- `ServiceStatusTab`: React component
  - Props: None
  - Features:
    - Real-time status monitoring
    - Service health checks
    - Error reporting
    - Performance metrics

#### base-provider.ts

Base class for provider implementations.

**Exports:**

- `abstract class BaseProvider`
  - Methods:
    - `abstract getStatus(): Promise<ProviderStatus>`
    - `abstract testConnection(): Promise<boolean>`
    - `abstract getModels(): Promise<Model[]>`

#### provider-factory.ts

Factory for creating provider instances.

**Exports:**

- `createProvider(type: ProviderType): BaseProvider`
- `getProviderConfig(type: ProviderType): ProviderConfig`

#### types.ts

Type definitions for provider functionality.

**Exports:**

```typescript
export interface ProviderStatus {
  available: boolean;
  latency?: number;
  error?: string;
}

export interface ProviderConfig {
  type: ProviderType;
  baseUrl?: string;
  apiKey?: string;
  models?: Model[];
}

export type ProviderType = 'openai' | 'anthropic' | 'google' | 'mistral' | 'ollama';
```

## Provider Implementations

Each provider in `service-status/providers/` implements the `BaseProvider` class with specific functionality for that service:

- `amazon-bedrock.ts`: Amazon Bedrock integration
- `anthropic.ts`: Anthropic Claude integration
- `cohere.ts`: Cohere integration
- `deepseek.ts`: DeepSeek integration
- `google.ts`: Google AI integration
- `groq.ts`: Groq integration
- `huggingface.ts`: HuggingFace integration
- `hyperbolic.ts`: Hyperbolic integration
- `mistral.ts`: Mistral AI integration
- `openai.ts`: OpenAI integration
- `openrouter.ts`: OpenRouter integration
- `perplexity.ts`: Perplexity AI integration
- `together.ts`: Together AI integration
- `xai.ts`: xAI integration

Each provider implementation exports:

```typescript
export class ProviderImplementation extends BaseProvider {
  getStatus(): Promise<ProviderStatus>;
  testConnection(): Promise<boolean>;
  getModels(): Promise<Model[]>;
  // Provider-specific methods
}
```

## Usage

```typescript
import { CloudProvidersTab } from './cloud/CloudProvidersTab';
import { LocalProvidersTab } from './local/LocalProvidersTab';
import { ServiceStatusTab } from './service-status/ServiceStatusTab';

function ProviderSettings() {
  return (
    <div>
      <CloudProvidersTab />
      <LocalProvidersTab />
      <ServiceStatusTab />
    </div>
  );
}
```

## State Management

The module uses several stores:

```typescript
interface ProviderStore {
  providers: Record<ProviderType, ProviderConfig>;
  status: Record<ProviderType, ProviderStatus>;
  selectedProvider?: ProviderType;
}
```

## Events and Callbacks

- Provider configuration changes
- Status updates
- Model selection
- Installation progress
- Connection testing
- Error handling

## Error Handling

- Invalid configurations
- Connection failures
- Installation errors
- API errors
- Rate limiting

## Best Practices

1. **Provider Management**

   - Validate configurations
   - Handle rate limits
   - Monitor status
   - Cache responses
   - Handle errors gracefully

2. **Security**

   - Secure API key storage
   - Validate endpoints
   - Handle authentication
   - Protect sensitive data
   - Monitor access

3. **Performance**

   - Cache provider status
   - Optimize requests
   - Handle timeouts
   - Monitor resources
   - Implement retry logic

4. **User Experience**

   - Clear error messages
   - Status indicators
   - Progress feedback
   - Loading states
   - Responsive UI

5. **Testing**
   - Unit tests
   - Integration tests
   - Status monitoring
   - Error scenarios
   - Performance testing
