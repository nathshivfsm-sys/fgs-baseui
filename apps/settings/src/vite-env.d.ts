/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /**
   * When `'true'` in a Vite dev server, standalone bootstrap starts MSW.
   * Federated Settings is covered by the shell's worker instead.
   */
  readonly VITE_USE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

