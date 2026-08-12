import { lazy, type ComponentType } from 'react';
import { loadRemote, registerRemotes } from '@module-federation/runtime';

export interface ProviderConfig {
  name: string;
  entry: string;
}

export type ProviderMap = Record<string, ProviderConfig>;

export function registerProviders(providers: ProviderMap) {
  registerRemotes(
    Object.entries(providers).map(([alias, provider]) => ({
      alias,
      name: provider.name,
      entry: provider.entry,
      type: 'module',
    })),
  );
}

export function lazyProvider<Props = unknown>(
  alias: string,
  exposeName: string,
) {
  return lazy(async () => {
    const module = await loadRemote<{ default: ComponentType<Props> }>(
      `${alias}/${exposeName}`,
    );
    if (!module)
      throw new Error(`Remote ${alias}/${exposeName} returned no module`);
    return { default: module.default };
  });
}
