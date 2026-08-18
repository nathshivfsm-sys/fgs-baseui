import { readFileSync } from 'node:fs';
import nxEslintPlugin from '@nx/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import * as jsoncParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

/**
 * @nx/enforce-module-boundaries resolves every non-relative import by walking:
 * tsconfig paths -> lockfile-derived "npm:" external nodes -> raw `require.resolve`.
 * In this workspace (Nx 23.1.1, Windows, npm workspaces with no per-app package.json)
 * the lockfile-derived external nodes never populate — createProjectGraphAsync()
 * returns zero external nodes even though the lockfile itself parses correctly in
 * isolation — so every bare specifier falls through to the `require.resolve` path.
 * That path returns an OS-native (backslash) relative path on Windows, which the
 * rule's own `node_modules/` prefix check only matches with a forward slash, so the
 * check silently fails to recognize the resolved file as external and instead
 * attributes it to the workspace-root pseudo-project (registered because root
 * package.json carries an "nx" key), which Nx infers as type "app" — triggering a
 * false "Imports of apps are forbidden" for every external package. Allow-listing
 * this workspace's real external dependencies (computed from the actual
 * package.json files below, not hand-maintained) routes them around the broken
 * resolution entirely; internal @cms/* and cross-project resolution are unaffected
 * and already verified working.
 */
function externalPackageAllowPatterns() {
  const files = [
    'package.json',
    'libs/ui/package.json',
    'libs/platform-contract/package.json',
  ];
  const names = new Set();
  for (const file of files) {
    const pkg = JSON.parse(readFileSync(file, 'utf-8'));
    for (const field of [
      'dependencies',
      'devDependencies',
      'peerDependencies',
    ]) {
      Object.keys(pkg[field] ?? {}).forEach((name) => {
        if (!name.startsWith('@cms/')) names.add(name);
      });
    }
  }
  return [...names].flatMap((name) => [name, `${name}/**`]);
}

export default tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/.nx',
      '**/.storybook/dist',
      '**/coverage',
      '**/node_modules',
      '**/*.d.ts',
      // EJS-templated source used by `nx g ./tools/generators/remote-app` —
      // contains `<%= %>` placeholders that aren't valid TS/JSON syntax.
      'tools/generators/**/files/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
    extends: [tseslint.configs.recommended],
    plugins: { '@nx': nxEslintPlugin },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: externalPackageAllowPatterns(),
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            {
              sourceTag: 'type:integration',
              onlyDependOnLibsWithTags: ['type:app', 'type:lib'],
            },
            {
              sourceTag: 'scope:shell',
              onlyDependOnLibsWithTags: ['scope:shell', 'scope:shared'],
            },
            {
              sourceTag: 'scope:workorder',
              onlyDependOnLibsWithTags: ['scope:workorder', 'scope:shared'],
            },
            {
              sourceTag: 'scope:lead',
              onlyDependOnLibsWithTags: ['scope:lead', 'scope:shared'],
            },
            {
              sourceTag: 'scope:invoice',
              onlyDependOnLibsWithTags: ['scope:invoice', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['lucide-react'],
              message:
                'Use hand-traced icons from @cms/ui instead of lucide-react — see coding-standards.md.',
            },
          ],
        },
      ],
      // TS already checks unused bindings with better fidelity (type-only imports, etc.).
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    // index.ts uses a triple-slash reference (not an `import`) specifically because
    // this augmentation file is type-only: importing it as a normal ES module would
    // try to resolve a runtime module for a file that has no JS emit, which fails at
    // dev-server load time (esbuild/Vite still attempt to load side-effect imports).
    // The triple-slash directive is compile-time only and is the correct tool here.
    files: ['libs/platform-contract/src/index.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    // shared.ts reads two package.json files purely for their "version" field, to
    // keep Module Federation's requiredVersion in sync automatically (see
    // context/features/monorepo-architecture-remediation-prd.md, requirement 13).
    // This is metadata access, not a dependency on @cms/ui's or
    // @cms/platform-contract's exported runtime API, and package.json has no
    // sensible tsconfig path alias — relative `require()` is the correct tool here.
    files: ['tools/module-federation/shared.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    // This integration test deliberately reaches into apps/lead and apps/workorder's
    // internal query/runtime modules to verify cross-app QueryClient invariants — the
    // exact reason this project is tagged type:integration (allowed to depend on
    // type:app / type:lib) in eslint.config.mjs's depConstraints above. Nx's
    // noRelativeOrAbsoluteImportsAcrossLibraries check is separate from depConstraints
    // and unconditionally forbids relative cross-project imports regardless of tags;
    // these apps have no public entrypoint for test-only internals, so this is the
    // "minimum acceptable" documented exception from
    // context/features/monorepo-architecture-remediation-prd.md, requirement 4.
    files: ['tools/integration/src/query-runtime.integration.test.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    // Vite loads *.vite.config.ts itself, outside the app's own bundling pipeline, so
    // it cannot honor tsconfig path aliases (the alias config lives inside the very
    // file being loaded) — these imports of the shared Module Federation config must
    // stay relative. `tools/module-federation` is tagged type:lib/scope:shared and is
    // reachable via the @cms/module-federation-shared alias from application code;
    // this override only covers the config-loading entry point itself.
    files: ['apps/*/vite.config.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: { parser: jsoncParser },
    rules: {},
  },
  eslintConfigPrettier,
);
