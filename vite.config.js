import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        services: resolve(__dirname, 'services.html'),
        process: resolve(__dirname, 'process.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});
