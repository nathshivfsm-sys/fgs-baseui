#!/usr/bin/env node
/**
 * Reject tracked paths that cannot be checked out on every developer's machine.
 *
 * Git happily stores a path that the local filesystem accepts, so a name that
 * is legal on macOS/Linux can land on `develop` and then break `git pull` for
 * every Windows colleague with "error: invalid path" — an error that cannot be
 * worked around locally (Git validates path names while building index
 * entries, so even sparse-checkout does not skip them).
 *
 * This check inspects the *path strings Git has recorded*, never the local
 * filesystem, so it behaves identically on macOS, Linux and Windows. It runs
 * against the index/worktree by default, or against a commit-ish argument.
 */
import { spawnSync } from 'node:child_process';

// A plain character list rather than a regex class, so the backslash
// (fromCharCode(92)) needs no escaping.
const WINDOWS_RESERVED_CHARS = '<>:"|?*' + String.fromCharCode(92);
const CONTROL_CHARS = /[\u0000-\u001f]/;
const WINDOWS_RESERVED_NAMES =
  /^(con|prn|aux|nul|com[0-9\u00b2\u00b3\u00b9]|lpt[0-9\u00b2\u00b3\u00b9])(\..*)?$/i;

const revision = process.argv[2];

function listTrackedPaths() {
  const args = revision
    ? ['ls-tree', '-r', '-z', '--name-only', revision]
    : ['ls-files', '-z'];
  // protectNTFS=false so this check can still *read* an already-broken tree on
  // Windows; without it Git refuses before we get a chance to report anything.
  const result = spawnSync('git', ['-c', 'core.protectNTFS=false', ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) {
    console.error(result.stderr || 'git failed to list tracked paths');
    process.exit(1);
  }
  return result.stdout.split('\0').filter(Boolean);
}

/** @returns {string | null} why this path is not portable, or null if it is */
function diagnose(path) {
  if (CONTROL_CHARS.test(path)) {
    return 'contains a control character';
  }
  const badChar = Array.from(path).find((char) =>
    WINDOWS_RESERVED_CHARS.includes(char),
  );
  if (badChar) {
    return `contains ${JSON.stringify(badChar)}, which is illegal in a Windows filename`;
  }
  for (const segment of path.split('/')) {
    if (segment !== segment.replace(/[. ]+$/, '')) {
      return `segment ${JSON.stringify(segment)} ends with a dot or space, which Windows silently strips`;
    }
    if (WINDOWS_RESERVED_NAMES.test(segment)) {
      return `segment ${JSON.stringify(segment)} is a reserved Windows device name`;
    }
  }
  return null;
}

const paths = listTrackedPaths();
const problems = [];

for (const path of paths) {
  const reason = diagnose(path);
  if (reason) problems.push({ path, reason });
}

// Two paths differing only in case cannot coexist in a Windows or default
// macOS checkout — one silently overwrites the other.
const byLowercase = new Map();
for (const path of paths) {
  const key = path.toLowerCase();
  const group = byLowercase.get(key);
  if (group) group.push(path);
  else byLowercase.set(key, [path]);
}
for (const group of byLowercase.values()) {
  if (group.length > 1) {
    problems.push({
      path: group.join(' / '),
      reason:
        'these paths differ only in letter case and collide on case-insensitive filesystems',
    });
  }
}

if (problems.length === 0) {
  console.log(
    `check-portable-paths: ${paths.length} tracked paths are portable.`,
  );
  process.exit(0);
}

console.error(
  `\ncheck-portable-paths: ${problems.length} non-portable path(s) found` +
    `${revision ? ` in ${revision}` : ''}:\n`,
);
for (const { path, reason } of problems) {
  console.error(`  ${path}\n      ${reason}\n`);
}
console.error(
  'These break `git pull` or `git checkout` for teammates on other platforms.\n' +
    'For Nx generator templates, put the variable in the path as __variable__\n' +
    '(e.g. __className__Page.tsx) — generateFiles only substitutes that form in\n' +
    'file names; <%= %> tags work in file *contents* only.\n',
);
process.exit(1);
