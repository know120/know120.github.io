import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // server: {
  //   proxy: {
  //     // Proxy /api requests to the Meta Graph API
  //     '/api': {
  //       target: 'https://graph.facebook.com',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  // The base path for GitHub Pages. For a user page like `know120.github.io`, this is '/'.
  base: '/',
  build: {
    // Output to the 'docs' folder for GitHub Pages deployment.
    outDir: 'docs',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js', // File for test environment setup.
  },
});