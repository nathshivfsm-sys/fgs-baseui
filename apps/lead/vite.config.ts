import { fileURLToPath, URL } from 'node:url';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const shared = {
  react: { singleton: true, requiredVersion: '19.2.8' },
  'react-dom': { singleton: true, requiredVersion: '19.2.8' },
  'react-router-dom': { singleton: true, requiredVersion: '7.18.2' },
  '@tanstack/react-query': { singleton: true, requiredVersion: '5.101.4' },
  zustand: { singleton: true, requiredVersion: '5.0.14' },
  '@cms/ui': { singleton: true, requiredVersion: '0.0.1' },
};

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
      shared,
    }),
    react(),
  ],
});
