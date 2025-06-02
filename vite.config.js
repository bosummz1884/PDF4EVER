// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.', // Project root (where index.html is located)
  publicDir: 'public', // Static assets directory

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),         // Use "@/components/YourFile"
      '@src': path.resolve(__dirname, 'src'),      // Optional fallback
      '@public': path.resolve(__dirname, 'public'),
      'components': path.resolve(__dirname, 'src/components'), // Direct alias for components
      'utils': path.resolve(__dirname, 'src/utils')            // Direct alias for utils
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          pdf: ['pdf-lib', 'pdfjs-dist'],
          util: ['opentype.js', 'file-saver', 'blob-stream']
        }
      }
    }
  },

  server: {
    host: '127.0.0.1',
    port: 5173,
    open: true
  },

  preview: {
    port: 4173,
    open: true
  }
});
