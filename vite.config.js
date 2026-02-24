import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'src/pages/services.html'),
        partners: resolve(__dirname, 'src/pages/partners.html'),
      },
    },
  },
});

