import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'workflow-ux-profiles',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './Topbar': './src/components/layout/Topbar/Topbar.tsx',
        './Sidebar': './src/components/layout/Sidebar/Sidebar.tsx',
        './AppRoutes': './src/components/approutes/AppRoutes/AppRoutes.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      exclude: [
        'src/api/**',
        'node_modules/',
        'src/test/',
      ],
    },
  },
})
