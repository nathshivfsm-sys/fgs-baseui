import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteBase } from '../../tools/module-federation/base';
import { sharedDependencies } from '../../tools/module-federation/shared';

export default defineConfig({
  base: viteBase('customer'),
  server: {
    port: 5105,
    strictPort: true,
    origin: 'http://localhost:5105',
    host: '127.0.0.1',
    cors: true,
  },
  preview: { port: 5105, strictPort: true, cors: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({
      name: 'customer',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: sharedDependencies,
    }),
    react(),
  ],
});
