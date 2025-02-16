# Common Module

This module contains common utilities and shared functionality for the Bolt application, particularly focusing on prompt management and system prompts.

## Files

### prompt-library.ts

Manages a collection of system prompts for the application.

**Exports:**

- `interface PromptOptions`

  - `cwd`: string
  - `allowedHtmlElements`: string[]
  - `modificationTagName`: string

- `class PromptLibrary`
  - Static Properties:
    - `library`: Record of prompt configurations
      - `default`: Default system prompt
      - `optimized`: Experimental optimized prompt
  - Static Methods:
    - `getList()`: Returns list of available prompts
    - `getPropmtFromLibrary(promptId: string, options: PromptOptions)`: Retrieves specific prompt

### prompts/

Directory containing prompt implementations.

#### prompts.ts

Contains the main system prompt implementation.

**Exports:**

- `getSystemPrompt(cwd: string)`: Function
  - Returns the default system prompt
  - Includes:
    - System constraints
    - Code formatting rules
    - Message formatting guidelines
    - Chain of thought instructions
    - Artifact information and examples

#### optimized.ts

Contains an optimized version of the system prompt.

**Exports:**

- `default(options: PromptOptions)`: Function
  - Returns optimized system prompt
  - Includes condensed versions of:
    - System constraints
    - Formatting rules
    - Critical rules
    - Usage examples

## Usage

The common module provides:

1. Centralized prompt management
2. System prompt variations
3. Consistent formatting rules
4. Development guidelines

This module is essential for maintaining consistent interaction patterns and development standards across the application.
