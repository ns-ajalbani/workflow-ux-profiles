import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/workflow-ux-profiles/' : '/',
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
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
})
