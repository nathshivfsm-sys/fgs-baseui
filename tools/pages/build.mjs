#!/usr/bin/env node
/**
 * Production-build every deployable Vite app (federated remotes, then the shell).
 *
 * Apps compile workspace libraries from source, so this does not run the
 * publishable `ui` / `platform-contract` library rollup targets.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const viteBin = join(repoRoot, 'node_modules', '.bin', 'vite');
const devConfig = JSON.parse(
  readFileSync(join(repoRoot, 'apps/shell/public/config.json'), 'utf8'),
);
const remotes = Object.keys(devConfig.remotes ?? {});
const apps = [...remotes, 'shell'];

for (const app of apps) {
  console.log(`\nBuilding ${app}…`);
  const result = spawnSync(viteBin, ['build'], {
    cwd: join(repoRoot, 'apps', app),
    env: process.env,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
