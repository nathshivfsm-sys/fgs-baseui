import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteBase } from '../../tools/module-federation/base';
import { sharedDependencies } from '../../tools/module-federation/shared';

export default defineConfig({
  base: viteBase('lead'),
  server: {
    port: 5102,
    strictPort: true,
    origin: 'http://localhost:5102',
    host: '127.0.0.1',
    cors: true,
  },
  preview: { port: 5102, strictPort: true, cors: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({
      name: 'lead',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: sharedDependencies,
    }),
    react(),
  ],
});
