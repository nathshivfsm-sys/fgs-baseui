import { fileURLToPath, URL } from 'node:url';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import {
  sharedDependencies,
  workspaceAliases,
} from '../../tools/module-federation/shared';

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  resolve: {
    alias: workspaceAliases(workspaceRoot),
  },
  server: {
    port: <%= port %>,
    strictPort: true,
    origin: 'http://localhost:<%= port %>',
    host: '127.0.0.1',
    cors: true,
  },
  preview: { port: <%= port %>, strictPort: true, cors: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({
      name: '<%= name %>',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: sharedDependencies,
    }),
    react(),
  ],
});
