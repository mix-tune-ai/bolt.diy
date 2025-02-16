# Modules

This directory contains modular functionality for Bolt, with a focus on Language Model (LLM) integration.

## Directories

### llm/

Contains the core LLM integration functionality.

#### Files

##### types.ts

Type definitions for LLM integration.

**Exports:**

- `interface ModelInfo`

  - `name`: string
  - `label`: string
  - `provider`: string
  - `maxTokenAllowed`: number

- `interface ProviderInfo`

  - `name`: string
  - `staticModels`: ModelInfo[]
  - `getDynamicModels?`: Function for fetching dynamic models
  - `getModelInstance`: Function for creating model instances
  - `getApiKeyLink?`: string
  - `labelForGetApiKey?`: string
  - `icon?`: string

- `interface ProviderConfig`
  - `baseUrlKey?`: string
  - `baseUrl?`: string
  - `apiTokenKey?`: string

##### base-provider.ts

Abstract base class for LLM providers.

**Exports:**

- `abstract class BaseProvider`

  - Abstract Properties:
    - `name`: string
    - `staticModels`: ModelInfo[]
    - `config`: ProviderConfig
  - Methods:
    - `getProviderBaseUrlAndKey(options)`: Gets provider configuration
    - `getModelsFromCache(options)`: Retrieves cached models
    - `getDynamicModelsCacheKey(options)`: Generates cache key
    - `storeDynamicModels(options, models)`: Caches models
    - `abstract getModelInstance(options)`: Creates model instance

- `function getOpenAILikeModel(baseURL, apiKey, model)`
  - Creates OpenAI-compatible model instances

##### manager.ts

LLM provider management system.

**Exports:**

- `class LLMManager`
  - Static Methods:
    - `getInstance(env)`: Gets singleton instance
  - Methods:
    - `registerProvider(provider)`: Registers new provider
    - `getProvider(name)`: Gets provider by name
    - `getAllProviders()`: Lists all providers
    - `getModelList()`: Gets all available models
    - `updateModelList(options)`: Updates model list
    - `getStaticModelList()`: Gets static models
    - `getModelListFromProvider(provider, options)`: Gets provider models
    - `getDefaultProvider()`: Gets default provider

##### registry.ts

Provider registry and exports.

**Exports:**

- Multiple provider class exports including:
  - `AnthropicProvider`
  - `CohereProvider`
  - `DeepseekProvider`
  - `GoogleProvider`
  - `GroqProvider`
  - And many others...

##### providers/

Directory containing individual provider implementations.

## Usage

The modules directory, particularly the LLM module, provides:

1. Extensible provider system for LLM integration
2. Model management and caching
3. Provider configuration and authentication
4. Dynamic and static model support

This module is central to Bolt's AI capabilities, managing the integration with various LLM providers and handling model operations.
