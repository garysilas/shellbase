import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    build: {
      outDir: 'dist-electron/main',
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      outDir: 'dist-electron/preload',
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: resolve(__dirname, 'src/renderer'),
    build: {
      outDir: resolve(__dirname, 'dist-renderer'),
      emptyOutDir: true,
    },
    plugins: [react()],
  },
});
