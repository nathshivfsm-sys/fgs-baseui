#!/usr/bin/env node
/**
 * Installs the shared Git pre-commit hook into this clone.
 * `git rev-parse --git-path hooks` follows worktrees, so the hook is the one
 * Git runs for a manual commit. Does not change git config.
 */
import { execFileSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const MARKER = 'tools/hooks/git-pre-commit.mjs';

const HOOK = `#!/bin/sh
# Installed by tools/hooks/install-git-hooks.mjs
# Runs ${MARKER} when this checkout contains it.
if [ ! -f ${MARKER} ]; then
  echo "pre-commit: ${MARKER} is not in this checkout; skipping."
  exit 0
fi
exec node ${MARKER}
`;

function hooksDirectory() {
  try {
    return execFileSync('git', ['rev-parse', '--git-path', 'hooks'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return '';
  }
}

const hooksDir = hooksDirectory();
if (!hooksDir) {
  process.exit(0);
}

mkdirSync(hooksDir, { recursive: true });
const hookPath = join(hooksDir, 'pre-commit');
if (existsSync(hookPath) && !readFileSync(hookPath, 'utf8').includes(MARKER)) {
  process.stderr.write(
    `Left the existing pre-commit hook unchanged: ${hookPath}\n`,
  );
  process.exit(0);
}

writeFileSync(hookPath, HOOK.replace(/\r\n/g, '\n'), 'utf8');
chmodSync(hookPath, 0o755);
process.stdout.write(`Installed Git pre-commit hook: ${hookPath}\n`);
