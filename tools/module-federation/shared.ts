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
 */
export function workspaceAliases(workspaceRoot: string) {
  return {
    '@cms/ui': join(workspaceRoot, 'libs/ui/src/index.ts'),
    '@cms/platform-contract': join(
      workspaceRoot,
      'libs/platform-contract/src/index.ts',
    ),
    '@cms/shared-api': join(workspaceRoot, 'libs/shared/api/src/index.ts'),
  };
}
