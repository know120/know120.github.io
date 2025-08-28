import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // The base path for GitHub Pages. For a user page like `know120.github.io`, this is '/'.
  base: '/',
  build: {
    // Output to the 'docs' folder for GitHub Pages deployment.
    outDir: 'docs',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // File for test environment setup.
  },
});