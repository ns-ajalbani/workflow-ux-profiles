# Module Federation Setup

This project is configured with Module Federation to allow consuming applications to dynamically import components from the `workflow-ux-profiles` application.

## Exposed Modules

The following modules are exposed and can be consumed by other applications:

- `./App` - Main App component
- `./Topbar` - Topbar component
- `./Sidebar` - Sidebar component
- `./AppRoutes` - AppRoutes component

## Shared Dependencies

The following dependencies are shared across federated modules:

- `react` - React library
- `react-dom` - React DOM library
- `react-router-dom` - React Router library

## Usage in Consumer Application

To consume modules from this federation, set up the remote in your consumer app's `vite.config.ts`:

```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'consumer-app',
      remotes: {
        workflowProfiles: 'http://localhost:5173/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
})
```

## Dynamic Import Example

```typescript
import { lazy, Suspense } from 'react'

// Dynamically import the App component
const WorkflowApp = lazy(() => import('workflowProfiles/App'))

export function MyApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowApp />
    </Suspense>
  )
}
```

## Build Output

When built for production, the Module Federation files are generated in the `dist/` directory:

- `dist/remoteEntry.js` - Entry point for remote modules
- `dist/assets/__federation_expose_*.js` - Exposed module files
- `dist/assets/__federation_shared_*.js` - Shared dependency files

## Development

During development, the dev server serves the remote entry point at:

```
http://localhost:5173/assets/remoteEntry.js
```

## Shared Version Resolution

The `shared` configuration in `vite.config.ts` ensures that:
- If the consumer app already has `react`, `react-dom`, or `react-router-dom`, it uses the consumer's version
- If not, it loads the version from this federation
- This prevents duplicate dependencies and reduces bundle size

## More Information

- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
