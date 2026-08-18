import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);

const uiVersion: string = require('../../libs/ui/package.json').version;
const platformContractVersion: string = require(
  '../../libs/platform-contract/package.json',
).version;
const sharedApiVersion: string = require(
  '../../libs/shared/api/package.json',
).version;

export const sharedDependencies = {
  react: { singleton: true, requiredVersion: '19.2.8' },
  'react-dom': { singleton: true, requiredVersion: '19.2.8' },
  'react-router-dom': { singleton: true, requiredVersion: '7.18.2' },
  '@tanstack/react-query': { singleton: true, requiredVersion: '5.101.4' },
  '@cms/ui': { singleton: true, requiredVersion: uiVersion, strictVersion: false },
  // Trailing slash is @module-federation/vite's prefix-share convention: it covers
  // every @cms/ui/<subpath> deep import as the same singleton as the barrel above,
  // so a component reached via a deep import is still deduplicated across host/remote
  // bundles instead of each one shipping its own copy.
  '@cms/ui/': { singleton: true, requiredVersion: uiVersion, strictVersion: false },
  '@cms/platform-contract': {
    singleton: true,
    requiredVersion: platformContractVersion,
    strictVersion: false,
  },
  '@cms/shared-api': {
    singleton: true,
    requiredVersion: sharedApiVersion,
    strictVersion: false,
  },
} as const;

/**
 * Single source of truth for the `@cms/ui` / `@cms/platform-contract` dev-time
 * source aliases, previously declared independently in tsconfig.base.json and four
 * separate config files (three vite.config.ts plus .storybook/main.ts). Each caller
 * passes its own absolute path to the workspace root, since Vite config files and
 * Storybook's config loader each compute that root differently.
 *
 * Array form (not a plain object) so `@cms/ui` can express both a bare-specifier
 * entry and a `@cms/ui/<subpath>` entry with different replacement targets. Vite's
 * alias matcher (bundled @rollup/plugin-alias) treats a plain string `find` as a
 * prefix match too (`importee === find || importee.startsWith(find + '/')`), so a
 * single `'@cms/ui'` entry already "matched" deep imports — it just replaced them
 * with the barrel *file* path, producing an unresolvable path like
 * `.../index.ts/components/ui/button`. The two anchored regexes below give the
 * bare specifier and every subpath their own, correct replacement.
 */
export function workspaceAliases(workspaceRoot: string) {
  return [
    { find: /^@cms\/ui$/, replacement: join(workspaceRoot, 'libs/ui/src/index.ts') },
    {
      find: /^@cms\/ui\//,
      replacement: `${join(workspaceRoot, 'libs/ui/src')}/`,
    },
    {
      find: '@cms/platform-contract',
      replacement: join(workspaceRoot, 'libs/platform-contract/src/index.ts'),
    },
    {
      find: '@cms/shared-api',
      replacement: join(workspaceRoot, 'libs/shared/api/src/index.ts'),
    },
  ];
}
