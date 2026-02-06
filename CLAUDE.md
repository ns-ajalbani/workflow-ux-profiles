# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React 19 + TypeScript + Vite project for building UX workflow profiles. The project uses Vite for fast development and building, with TypeScript for type safety.

## Development Commands

```bash
# Start development server with HMR (Hot Module Replacement)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Architecture & Key Details

### Build Tooling

- **Vite** (`vite@7.2.4`): Modern build tool with fast dev server and optimized builds
- **React Plugin** (`@vitejs/plugin-react@5.1.1`): Uses Babel/oxc for Fast Refresh during development
- **TypeScript** (`typescript@5.9.3`): Strict mode enabled with comprehensive type checking

### TypeScript Configuration

**`tsconfig.app.json`** (for source code):

- Target: `ES2022`
- Strict mode enabled with aggressive flags:
  - `noUnusedLocals` and `noUnusedParameters` prevent unused code
  - `noFallthroughCasesInSwitch` prevents logic errors in switch statements
  - `noUncheckedSideEffectImports` requires explicit side effect imports
- JSX: `react-jsx` (automatic runtime, no need to import React in tsx files)

**`tsconfig.node.json`**: Separate config for build/config files with looser restrictions

### ESLint

ESLint is configured via `eslint.config.js` with:

- React Hooks rules via `eslint-plugin-react-hooks`
- React Refresh rules to prevent issues with hot module replacement
- TypeScript support via `typescript-eslint`

For production applications, consider enabling type-aware lint rules by extending `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked` in `eslint.config.js`.

### Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # Entry point (renders React to #root in index.html)
└── (other components and utilities)

public/            # Static assets served as-is
index.html         # HTML template with <div id="root"></div>
```

## Development Notes

- **Fast Refresh**: HMR is enabled by default in dev mode for instant feedback on code changes
- **React Compiler**: Not enabled by default due to performance impact. Can be added if needed (see README.md for instructions)
- **No test framework**: Currently no testing framework configured. Add Jest or Vitest if needed for unit tests
