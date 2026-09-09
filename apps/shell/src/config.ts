import type { ProviderMap } from './mf';

export interface RuntimeConfig {
  environment: string;
  remotes: ProviderMap;
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch(`${import.meta.env.BASE_URL}config.json`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Runtime config failed with HTTP ${response.status}`);
  }
  return response.json() as Promise<RuntimeConfig>;
}
