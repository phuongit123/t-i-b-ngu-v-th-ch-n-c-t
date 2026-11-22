import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { readFileSync } from 'node:fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'academy-preview-404',
    configurePreviewServer(server) {
      const publicRoot = path.resolve(server.config.root, 'public');
      const routes = new Set(readFileSync(path.join(publicRoot, '_redirects'), 'utf8')
        .split(/\r?\n/).filter(Boolean).map(line => line.split(' ')[0]));
      const notFound = readFileSync(path.join(publicRoot, '404.html'));
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://localhost').pathname.replace(/\/$/, '') || '/';
        if ((request.method === 'GET' || request.method === 'HEAD') && !routes.has(pathname.toLowerCase()) && !path.extname(pathname)) {
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(request.method === 'HEAD' ? undefined : notFound);
          return;
        }
        next();
      });
    },
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    watch: { ignored: ['**/test-results/**', '**/playwright-report/**', '**/tests/screenshots/**'] },
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
