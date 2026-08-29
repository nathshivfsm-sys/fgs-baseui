import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { sharedDependencies } from '../../tools/module-federation/shared';

export default defineConfig({
  server: { port: 4200, strictPort: true, host: '127.0.0.1' },
  preview: { port: 4200, strictPort: true },
  build: { target: 'chrome89' },
  plugins: [
    tailwindcss(),
    federation({ name: 'shell', shared: sharedDependencies }),
    react(),
  ],
});
