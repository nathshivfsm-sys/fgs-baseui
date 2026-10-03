// --no-warn-ignored
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Prefix for every customFetch endpoint: '/api/v1' locally, an absolute origin otherwise. */
  readonly VITE_API_URL?: string;
  /**
   * Dev-server-only CORS workaround: when set, vite.config.ts proxies /api/v1 here.
   * Read by the Vite config in Node via loadEnv, never by application code.
   */
  readonly VITE_DEV_API_PROXY_TARGET?: string;
  /**
   * When `'true'` in a Vite dev server, bootstrap starts MSW before render.
   * Query functions and `customFetch` are unchanged — only the network is mocked.
   */
  readonly VITE_USE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
