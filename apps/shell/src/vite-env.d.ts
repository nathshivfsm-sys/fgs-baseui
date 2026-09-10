/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Prefix for every customFetch endpoint: '/api/v1' locally, an absolute origin otherwise. */
  readonly VITE_API_URL?: string;
  /**
   * Local-development refresh token, exchanged for an access token at sign-in. See
   * apps/shell/.env.example — this is a stand-in for a real credential exchange.
   */
  readonly VITE_DEV_REFRESH_TOKEN?: string;
  /**
   * Dev-server-only CORS workaround: when set, vite.config.ts proxies /api/v1 here.
   * Read by the Vite config in Node via loadEnv, never by application code.
   */
  readonly VITE_DEV_API_PROXY_TARGET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
