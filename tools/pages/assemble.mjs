#!/usr/bin/env node
/**
 * Assemble a single GitHub Pages site from the shell host + federated remotes.
 *
 * Expects a production build with VITE_BASE_PATH already applied (the same
 * value must be set here so remoteEntry URLs match the Vite `base` used at
 * build time).
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const toRepo = (relative) => join(repoRoot, relative);

const rawBase = process.env.VITE_BASE_PATH ?? '/';
const repoBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
const outDir = toRepo('dist-pages');

const devConfigPath = toRepo('apps/shell/public/config.json');
const shellDist = toRepo('apps/shell/dist');

if (!existsSync(join(shellDist, 'index.html'))) {
  throw new Error(
    'Missing apps/shell/dist/index.html — run the production build first.',
  );
}

const devConfig = JSON.parse(readFileSync(devConfigPath, 'utf8'));
const remotes = Object.keys(devConfig.remotes ?? {});

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(shellDist, outDir, { recursive: true });

for (const name of remotes) {
  const src = toRepo(`apps/${name}/dist`);
  const remoteEntry = join(src, 'remoteEntry.js');
  if (!existsSync(remoteEntry)) {
    throw new Error(
      `Missing ${remoteEntry} — build the "${name}" remote before assembling.`,
    );
  }
  const dest = join(outDir, 'mf', name);
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (source) => basename(source) !== 'index.html',
  });
}

const productionConfig = {
  environment: 'production',
  remotes: Object.fromEntries(
    remotes.map((name) => [
      name,
      {
        name,
        entry: `${repoBase}mf/${name}/remoteEntry.js`,
      },
    ]),
  ),
};

writeFileSync(
  join(outDir, 'config.json'),
  `${JSON.stringify(productionConfig, null, 2)}\n`,
);

const indexHtml = readFileSync(join(outDir, 'index.html'), 'utf8');
writeFileSync(join(outDir, '404.html'), indexHtml);
writeFileSync(join(outDir, '.nojekyll'), '');

console.log(`Assembled GitHub Pages site at dist-pages/ (base ${repoBase})`);
for (const name of remotes) {
  console.log(`  remote ${name} -> ${repoBase}mf/${name}/remoteEntry.js`);
}
