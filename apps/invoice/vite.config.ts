import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { sharedDependencies } from '../../tools/module-federation/shared';

export default defineConfig({
  server: {
    port: 5103,
    strictPort: true,
    origin: 'http://localhost:5103',
    host: '127.0.0.1',
    cors: true,
  },
  preview: { port: 5103, strictPort: true, cors: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({
      name: 'invoice',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: sharedDependencies,
    }),
    react(),
  ],
});
