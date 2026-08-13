import { fileURLToPath, URL } from 'node:url';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { sharedDependencies } from '../../tools/module-federation/shared';

export default defineConfig({
  resolve: {
    alias: {
      '@cms/ui': fileURLToPath(
        new URL('../../libs/ui/src/index.ts', import.meta.url),
      ),
      '@cms/platform-contract': fileURLToPath(
        new URL('../../libs/platform-contract/src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    port: 5101,
    strictPort: true,
    origin: 'http://localhost:5101',
    host: '127.0.0.1',
    cors: true,
  },
  preview: { port: 5101, strictPort: true, cors: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({
      name: 'workorder',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: sharedDependencies,
    }),
    react(),
  ],
});
