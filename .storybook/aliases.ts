import { join } from 'node:path';

/**
 * Source aliases for `@cms/*` libraries, used **only** by Storybook.
 *
 * Storybook loads stories from a config at the workspace root, and the root
 * package.json declares no `@cms/*` dependencies — so there are no pnpm symlinks to
 * resolve through from `.storybook/fixtures/*`. These aliases fill that gap.
 *
 * Do NOT reuse this in an app's vite.config.ts. An alias rewrites the bare specifier to
 * a file path before `@module-federation/vite` can wrap the import in a `loadShare`
 * call, so the module bypasses the shared scope and every container bundles its own
 * copy — the plugin reports it as "Detected alias conflicts with shared modules". That
 * is invisible for stateless libraries but breaks anything carrying identity across the
 * boundary, such as the React context in `@cms/shared-auth`. The apps resolve these
 * packages through their package.json `exports` instead. Storybook has no Module
 * Federation, so aliasing there is safe.
 *
 * Array form (not a plain object) so `@cms/ui` can express both a bare-specifier entry
 * and a `@cms/ui/<subpath>` entry with different replacement targets. Vite's alias
 * matcher (bundled @rollup/plugin-alias) treats a plain string `find` as a prefix match
 * too (`importee === find || importee.startsWith(find + '/')`), so a single `'@cms/ui'`
 * entry would also "match" deep imports and replace them with the barrel *file* path,
 * producing an unresolvable path like `.../index.ts/components/ui/button`. The two
 * anchored regexes below give the bare specifier and every subpath their own, correct
 * replacement.
 */
export function storybookAliases(workspaceRoot: string) {
  return [
    {
      find: /^@cms\/ui$/,
      replacement: join(workspaceRoot, 'libs/ui/src/index.ts'),
    },
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
    {
      find: '@cms/shared-auth',
      replacement: join(workspaceRoot, 'libs/shared/auth/src/index.ts'),
    },
  ];
}
