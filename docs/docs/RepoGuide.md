# Bolt.diy Repository Guide

## Table of Contents

1. [Project Overview](#1-project-overview)

   - [Introduction](#introduction)
   - [Personality](#personality)
   - [Tech Stack](#tech-stack)
   - [Development Environment](#development-environment)

2. [Core Architecture](#2-core-architecture)

   - [Directory Structure](#directory-structure)
   - [Key Components](#key-components)
   - [File Organization](#file-organization)

3. [Modules](#3-modules)

   - [Chat Module](#chat-module)
   - [Editor Module](#editor-module)
   - [Workbench Module](#workbench-module)
   - [Settings Module](#settings-module)
   - [Providers Module](#providers-module)
   - [Terminal Module](#terminal-module)
   - [Sidebar Module](#sidebar-module)
   - [WebContainer Module](#webcontainer-module)

4. [Core Libraries](#4-core-libraries)

   - [API Library](#api-library)
   - [Hooks Library](#hooks-library)
   - [Utils Library](#utils-library)
   - [Types Library](#types-library)
   - [Common Library](#common-library)
   - [Persistence Library](#persistence-library)

5. [Development Guidelines](#5-development-guidelines)

   - [Development Process](#development-process)
   - [Problem Solving Approach](#problem-solving-approach)
   - [Code Quality](#code-quality)
   - [Code Writing](#code-writing)
   - [Code Refactoring](#code-refactoring)
   - [Code Review](#code-review)
   - [Comments](#comments)
   - [Error Handling](#error-handling)
   - [UI Guidelines](#ui-guidelines)
   - [Important Guidelines](#important-guidelines)
   - [Testing](#testing)
   - [Documentation](#documentation)

6. [Deployment & CI/CD](#6-deployment--cicd)

   - [GitHub Process](#github-process)
   - [Environment Variables](#environment-variables)
   - [Build Process](#build-process)

7. [Roadmap & Future Features](#7-roadmap--future-features)
   - [Planned Features](#planned-features)

## 1. Project Overview

### Introduction

Bolt.diy (previously oTToDev) is an open-source AI-powered full-stack web development platform that allows users to choose different LLM providers for coding assistance. The project supports multiple AI providers including OpenAI, Anthropic, Ollama, OpenRouter, Gemini, LMStudio, Mistral, xAI, HuggingFace, DeepSeek, and Groq.

### Personality

- Professional and technically precise
- Focus on best practices and clean code
- Provide clear explanations for code changes
- Maintain consistent code style with the existing codebase

### Tech Stack

- Framework: Remix
- Runtime: Node.js (>=18.18.0)
- Package Manager: pnpm
- UI: React with TypeScript
- Styling: UnoCSS
- Development Environment: Vite
- Testing: Vitest
- Deployment: Cloudflare Pages
- Containerization: Docker
- Code Quality: ESLint, Prettier, TypeScript

### Development Environment

- Follow .env.example for required environment variables
- Keep API keys and sensitive data in .env.local
- Never commit .env files (they are gitignored)

## 2. Core Architecture

### Directory Structure

```
📦bolt.diy
 ┣ 📂app
 ┃ ┣ 📂components
 ┃ ┣ 📂lib
 ┃ ┣ 📂routes
 ┃ ┣ 📂styles
 ┃ ┣ 📂types
 ┃ ┗ 📂utils
 ┣ 📂docs
 ┣ 📂functions
 ┣ 📂public
 ┣ 📂scripts
 ┗ 📂types
```

### Key Components

The application is built around several key components:

1. Chat Interface
2. Code Editor
3. Workbench
4. Settings Panel
5. Terminal
6. File Explorer
7. Preview Panel

### File Organization

- Main application code in /app directory
- Components follow a modular structure
- Server-side code in app/lib/.server
- Client-side utilities in app/lib/
- Type definitions in types/ directory
- Documentation in docs/ directory

## 3. Modules

### Chat Module

The chat module provides a sophisticated chat interface with support for multiple AI providers, real-time message streaming, file handling, and various interactive features.

#### Core Components

- Chat.client.tsx: Main chat component
- BaseChat.tsx: Foundational chat interface
- Messages.client.tsx: Message rendering
- APIKeyManager.tsx: API key management
- CodeBlock.tsx: Code syntax highlighting
- ModelSelector.tsx: AI model selection

#### Key Features

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

#### Integration Features

- Chat Export/Import
- Git Integration
- Speech Recognition
- File Preview
- Code Syntax Highlighting

### Editor Module

The editor module provides a powerful code editing experience using CodeMirror 6.

#### Core Components

- CodeMirrorEditor.tsx: Main editor component
- BinaryContent.tsx: Binary file handling
- Languages.ts: Language support
- Theme.ts: Editor theming

#### Features

- Syntax highlighting
- Auto-completion
- Code folding
- Search functionality
- Language detection
- Theme customization
- Line numbers
- Active line highlighting

### Workbench Module

The workbench module provides the main development workspace components.

#### Core Components

- Workbench.client.tsx: Main container
- EditorPanel.tsx: Code editing
- Preview.tsx: Application preview
- FileTree.tsx: File navigation
- Terminal integration
- Git integration

#### Features

- File system navigation
- Code editing
- Preview functionality
- Terminal integration
- Git integration
- File management
- Split views
- Project management

### Settings Module

The settings module provides a comprehensive settings management system.

#### Core Components

- ControlPanel.tsx: Main settings interface
- TabManagement.tsx: Tab organization
- Various settings tabs for different functionalities

#### Features

- Dynamic tab management
- Developer mode toggle
- Animated transitions
- Status indicators
- Beta feature labels
- Responsive layout
- Tab visibility control
- Window type switching

### Providers Module

The providers module manages AI provider configurations.

#### Core Components

- Cloud and Local provider management
- Service status monitoring
- Provider configuration
- API key management

#### Features

- Multiple provider support
- API key management
- Model configuration
- Service status monitoring
- Provider health checks
- Dynamic model loading

### Terminal Module

The terminal module provides terminal emulation using xterm.js.

#### Core Components

- Terminal.tsx: Core terminal component
- TerminalTabs.tsx: Tab management
- Theme.ts: Terminal theming

#### Features

- Multiple terminal support
- Theme customization
- Command history
- Split terminal views
- Search functionality
- Session management

### Sidebar Module

The sidebar module provides chat history management.

#### Core Components

- Menu.client.tsx: Main sidebar menu
- HistoryItem.tsx: Chat history items
- Date binning utilities

#### Features

- Chat history organization
- Search functionality
- Chat management
- Quick navigation
- Theme integration
- Responsive design

### WebContainer Module

The WebContainer module manages containerized environments.

#### Core Components

- WebContainer initialization
- Authentication handling
- Preview error management

#### Features

- Isolated environments
- Preview support
- File system access
- Terminal integration
- Network isolation
- Resource management

## 4. Core Libraries

### API Library

Utilities for API interactions and state management.

#### Components

- Connection management
- Cookie handling
- Debug utilities
- Feature flags
- Notification system
- Update checking

### Hooks Library

Custom React hooks for state management.

#### Available Hooks

| Hook                   | Description                       | Return Type                                                              |
| ---------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| useConnectionStatus    | Manages network connection status | { hasConnectionIssues: boolean, currentIssue: ConnectionIssueType, ... } |
| useDebugStatus         | Tracks debug-related issues       | { hasActiveWarnings: boolean, activeIssues: DebugIssue[], ... }          |
| useEditChatDescription | Manages chat description editing  | { editing: boolean, handleChange: Function, ... }                        |
| useFeatures            | Manages feature flags             | { hasNewFeatures: boolean, unviewedFeatures: Feature[], ... }            |
| useGit                 | Provides Git functionality        | { ready: boolean, gitClone: Function }                                   |
| useLocalProviders      | Manages local AI providers        | { localProviders: IProviderConfig[], ... }                               |
| useMessageParser       | Parses streaming messages         | { parsedMessages: Record<number, string>, ... }                          |
| useNotifications       | Manages notifications             | { hasUnreadNotifications: boolean, ... }                                 |
| usePromptEnhancer      | Enhances user prompts             | { enhancingPrompt: boolean, ... }                                        |
| useSettings            | Manages application settings      | UseSettingsReturn                                                        |
| useShortcuts           | Manages keyboard shortcuts        | void                                                                     |
| useSnapScroll          | Provides smooth scrolling         | [messageRef, scrollRef]                                                  |
| useUpdateCheck         | Checks for updates                | { hasUpdate: boolean, ... }                                              |
| useViewport            | Tracks viewport size              | boolean                                                                  |

### Utils Library

Utility functions for various operations.

#### Categories

- Buffer Management
- Class Name Utilities
- Constants
- Debouncing
- File Utilities
- Path Handling
- Promise Utilities
- Shell Utilities
- Terminal Utilities
- Markdown Processing
- OS Detection
- Project Commands
- Stack Trace Cleaning

### Types Library

TypeScript type definitions.

#### Key Type Definitions

- GitHub Types
- Action Types
- Artifact Types
- Context Types
- Model Types
- Terminal Types
- Theme Types

### Common Library

Shared functionality focusing on prompt management.

#### Features

- Prompt Library
- System Prompts
- Prompt Optimization
- Format Handling
- Template Management

### Persistence Library

Data persistence and storage functionality.

#### Features

- Chat History Management
- Local Storage Operations
- Database Operations
- State Persistence
- Data Migration
- Cache Management

## 5. Development Guidelines

### Development Process

- Write 3 reasoning paragraphs before implementing solutions
- Analyze the problem space thoroughly before jumping to conclusions
- Consider all edge cases and potential impacts
- Process tasks with a Senior Developer mindset
- Continue working until the solution is complete and verified
- Remember and consider the full commit/change history when working

### Problem Solving Approach

1. Understand the context fully before making changes
2. Document your reasoning and assumptions
3. Consider alternative approaches and their trade-offs
4. Validate your solution against existing patterns
5. Test thoroughly before considering work complete
6. Review impact on related components

### Code Quality

- Maintain readability over conciseness
- Preserve existing comments
- Add meaningful documentation
- Follow "Clean Code, Clear Intent"
- Avoid premature optimization
- Think twice, code once

### Code Writing

- Follow TypeScript best practices
- Use functional components for React
- Implement proper error boundaries
- Write testable code
- Follow the DRY principle

### Code Refactoring

- Maintain backward compatibility
- Update tests alongside changes
- Document breaking changes
- Follow the project's type system
- Keep components modular and reusable

### Code Review

- Check for type safety
- Verify error handling
- Ensure code follows project patterns
- Look for performance implications
- Validate accessibility standards

### Comments

- Use JSDoc for function documentation
- Keep comments clear and concise
- Document complex logic and business rules
- Update comments when changing code
- Remove redundant comments
- Always write comments that are relevant to the code they describe
- Ensure comments explain the "why" not just the "what"

### Error Handling

1. Identify root causes
2. Check dependencies
3. Verify type safety
4. Test locally
5. Follow existing patterns

### UI Guidelines

- Consistent design language
- Responsive and accessible
- Clear user feedback
- Meaningful icons
- Clean organization
- Consistent spacing
- Match existing style
- Use consistent naming conventions for components and variables
- Use consistent file and folder structure
- Respect the Light/Dark mode
- Don't use white background for dark mode
- Don't use white text on white background for dark mode
- Match the style of the existing codebase

### Important Guidelines

- Keep dependencies updated
- Follow TypeScript strict mode
- Maintain backward compatibility
- Document API changes
- Test cross-browser compatibility

### Testing

- Unit testing
- Integration testing
- Cross-browser testing
- Accessibility testing
- Performance testing
- Security testing

### Documentation

- JSDoc for functions
- Clear, concise comments
- Document complex logic
- Update documentation
- Remove redundancy
- Relevant comments only

## 6. Deployment & CI/CD

### GitHub Process

1. Conventional commits
2. Pre-commit checks
3. Feature branches
4. Clear PR descriptions
5. CI/CD verification

### Environment Variables

- Follow .env.example
- Secure sensitive data
- Never commit .env
- Proper naming
- Complete documentation

### Build Process

1. Code quality checks
2. Unit tests
3. Integration tests
4. Build optimization
5. Cloudflare deployment
6. Post-deployment checks

## 7. Roadmap & Future Features

### Planned Features

#### AI & LLM Enhancements

- Prompt Library with different prompts per LLM
- Self-correction capabilities - LLM detects and fixes errors
- Implement Agents instead of single LLM calls
- Upload documents for LLM knowledge
- Better planning with:
  - Reasoning model
  - Markdown files
  - Plan writing
  - Additional planning tools

#### Development Tools

- File locking and diffs
- One-click deploy to Netlify
- Supabase integration

#### Extension System

- Build an extension marketplace
  - Frontend for adding extensions without GitHub updates
  - User-facing extension marketplace interface
  - Extension enable/disable per user
  - Backend for extension library
  - Automated testing of new extensions

Let me know if you'd like me to continue analyzing Documentation.md for more missing content.
