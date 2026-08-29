/**
 * Module Federation shared-dependency config, used by every app's `vite.config.ts`.
 *
 * **Never add a `resolve.alias` entry for anything listed in `sharedDependencies`.**
 * An alias rewrites the bare specifier to a file path before `@module-federation/vite`
 * can wrap the import in a `loadShare` call, so the module bypasses the shared scope
 * entirely and every container bundles its own copy — `singleton: true` notwithstanding.
 * The plugin reports it on every build as "Detected alias conflicts with shared
 * modules ... will bypass Module Federation's sharing mechanism".
 *
 * The `@cms/*` libraries carried exactly that conflict until their package.json
 * `exports` were pointed at source, letting the apps resolve them through the pnpm
 * workspace symlink instead. Storybook still aliases them — it has no Module
 * Federation, and the workspace root has no `@cms/*` symlinks — see
 * `.storybook/aliases.ts`.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const uiVersion: string = require('../../libs/ui/package.json').version;
const platformContractVersion: string =
  require('../../libs/platform-contract/package.json').version;
const sharedApiVersion: string =
  require('../../libs/shared/api/package.json').version;
const sharedAuthVersion: string =
  require('../../libs/shared/auth/package.json').version;

export const sharedDependencies = {
  react: { singleton: true, requiredVersion: '19.2.8' },
  'react-dom': { singleton: true, requiredVersion: '19.2.8' },
  'react-router-dom': { singleton: true, requiredVersion: '7.18.2' },
  '@tanstack/react-query': { singleton: true, requiredVersion: '5.101.4' },
  '@cms/ui': {
    singleton: true,
    requiredVersion: uiVersion,
    strictVersion: false,
  },
  // NOTE: there is deliberately no '@cms/ui/' prefix-share entry. It would cover
  // @cms/ui/<subpath> deep imports as the same singleton as the barrel, but the plugin
  // resolves a prefix share against the package root rather than through package.json
  // `exports`, so it looks for libs/ui/<subpath> and the build fails with
  // "Could not resolve .../libs/ui/index.js". Deep imports therefore resolve through
  // the "./*": "./src/*" export and are bundled per container instead of shared. That
  // is safe for presentational components, which hold no cross-boundary state; the
  // barrel import is shared and remains the default. See libs/ui/README.md.
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
  // The one entry where duplication is immediately fatal rather than merely wasteful:
  // the auth React context is consumed by remotes and is identified by object identity,
  // so a second instance makes `useAuth` throw "must be used within an AuthProvider"
  // even though the host is rendering one.
  '@cms/shared-auth': {
    singleton: true,
    requiredVersion: sharedAuthVersion,
    strictVersion: false,
  },
} as const;
