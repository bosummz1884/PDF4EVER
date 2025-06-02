import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // Current directory as root
  publicDir: 'public', // Static assets (favicon, fonts, etc.)
  plugins: [react()],
  build: {
    outDir: 'dist', // Output folder
    assetsDir: 'assets', // Folder for JS/CSS chunks
    sourcemap: true, // Enable source maps for debugging
    chunkSizeWarningLimit: 1500, // Raise limit to suppress chunk size warnings
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          pdf: ['pdf-lib', 'pdfjs-dist'],
          util: ['opentype.js', 'file-saver', 'blob-stream'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for cleaner imports
      '@src': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
});
