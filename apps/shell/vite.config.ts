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
  server: { port: 4200, strictPort: true, host: '127.0.0.1' },
  preview: { port: 4200, strictPort: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({ name: 'shell', shared: sharedDependencies }),
    react(),
  ],
});
