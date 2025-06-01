import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // Use current directory as root
  publicDir: 'public', // Static assets (favicon, fonts, etc.)
  build: {
    outDir: 'dist', // Output folder
    assetsDir: 'assets', // Folder for JS/CSS chunks
    sourcemap: true, // Enable source maps for debugging
    chunkSizeWarningLimit: 1500, // Raise limit to suppress chunk size warnings
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Entry HTML
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
      // Optional path shortcuts if needed later
      '@src': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  server: {
    port: 5173, // Dev server port
    open: true, // Auto-open browser
  },
  preview: {
    port: 4173, // Preview server port
    open: true,
  },
});
