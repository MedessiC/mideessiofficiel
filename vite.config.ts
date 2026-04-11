import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Génère des hash pour tous les assets pour éviter le cache
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Force le build avec hash
    cssCodeSplit: true,
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    // En développement, désactive le cache
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  }
});
