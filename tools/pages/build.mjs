#!/usr/bin/env node
/**
 * Production-build every deployable Vite app (federated remotes, then the shell).
 *
 * Apps compile workspace libraries from source, so this does not run the
 * publishable `ui` / `platform-contract` library rollup targets.
 */
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
// Resolve Vite's own JS CLI entry and run it with `node` directly, rather than
// spawning `node_modules/.bin/vite`. That shim is a POSIX shell script on every
// platform pnpm supports (with `.cmd`/`.ps1` siblings on Windows) — spawning it
// portably needs `shell: true`, which then requires manually quoting any path
// containing spaces. Invoking the CLI's own script with `process.execPath`
// sidesteps both problems and needs no shell.
const require = createRequire(import.meta.url);
const vitePackageJsonPath = require.resolve('vite/package.json');
const viteCliEntry = join(
  dirname(vitePackageJsonPath),
  JSON.parse(readFileSync(vitePackageJsonPath, 'utf8')).bin.vite,
);
const devConfig = JSON.parse(
  readFileSync(join(repoRoot, 'apps/shell/public/config.json'), 'utf8'),
);
const remotes = Object.keys(devConfig.remotes ?? {});
const apps = [...remotes, 'shell'];

for (const app of apps) {
  console.log(`\nBuilding ${app}…`);
  const result = spawnSync(process.execPath, [viteCliEntry, 'build'], {
    cwd: join(repoRoot, 'apps', app),
    env: process.env,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
