import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
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
})
