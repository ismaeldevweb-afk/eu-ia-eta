import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'blog-local-routes',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const pathname = request.url?.split('?')[0] ?? '';

          if (/^\/blog\/[^/]+\/?$/.test(pathname)) {
            request.url = '/article.html';
          }

          if (pathname === '/sobre' || pathname === '/sobre/') {
            request.url = '/sobre.html';
          }

          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        article: resolve(__dirname, 'article.html'),
        sobre: resolve(__dirname, 'sobre.html')
      }
    }
  }
});
