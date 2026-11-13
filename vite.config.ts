import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('curriculum/designer')) {
            if (/curriculum[\\/]designer[\\/]D0[1-5]/.test(id)) {
              return 'curriculum-designer-foundations';
            }
            return 'curriculum-designer-advanced';
          }
          if (id.includes('curriculum/photo')) {
            if (/curriculum[\\/]photo[\\/]P0[1-5]/.test(id)) {
              return 'curriculum-photo-foundations';
            }
            return 'curriculum-photo-advanced';
          }
          if (id.includes('curriculum/publisher')) {
            return 'curriculum-publisher';
          }
          if (id.includes('curriculum/scripting')) {
            return 'curriculum-scripting';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
        },
      },
    },
  },
});
