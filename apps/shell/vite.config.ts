import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { viteBase } from '../../tools/module-federation/base';
import { sharedDependencies } from '../../tools/module-federation/shared';

export default defineConfig(({ mode }) => {
  // Read here rather than from import.meta.env: this file runs in Node, not the browser.
  const env = loadEnv(mode, import.meta.dirname, 'VITE_');

  // Dev-only escape hatch for CORS. The dev API sends no CORS headers for a localhost
  // origin, so a direct browser call is blocked; proxying keeps it same-origin, with
  // VITE_API_URL set to the relative '/api/v1'. customFetch only concatenates
  // baseUrl + endpoint, so no application code knows the difference.
  //
  // The target is deliberately not hardcoded. It comes from .env.local, which is
  // gitignored, so no API hostname is committed and any environment that does not set
  // the variable — CI, develop, every deployment — simply gets no proxy at all. It is
  // also a `server` option, which Vite applies only to the dev server: `vite build`
  // output contains no proxy, so this cannot reach a deployed bundle even if set.
  const devApiProxyTarget = env['VITE_DEV_API_PROXY_TARGET'];

  return {
    base: viteBase(),
    server: {
      port: 4200,
      strictPort: true,
      host: '127.0.0.1',
      ...(devApiProxyTarget
        ? {
            proxy: {
              '/api/v1': { target: devApiProxyTarget, changeOrigin: true },
            },
          }
        : {}),
    },
    preview: { port: 4200, strictPort: true },
    build: { target: 'chrome89' },
    plugins: [
      tailwindcss(),
      federation({ name: 'shell', shared: sharedDependencies }),
      react(),
    ],
  };
});
