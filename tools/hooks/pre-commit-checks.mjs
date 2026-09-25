import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

const PRETTIER_FILE = /\.(ts|tsx|js|jsx|json|md|css|mjs|cjs)$/i;
const ESLINT_FILE = /\.(ts|tsx|js|jsx|mjs|cjs)$/i;

export const CHECKS = {
  build: {
    scripts: ['build', 'pages:build'],
    stopOnFailure: true,
  },
};

export function listStagedFiles() {
  try {
    const output = execFileSync(
      'git',
      ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'],
      { cwd: repoRoot, encoding: 'utf8' },
    );
    return output.split('\0').filter(Boolean);
  } catch {
    return [];
  }
}

function stagedExistingFiles(matcher) {
  return listStagedFiles().filter(
    (file) => matcher.test(file) && existsSync(join(repoRoot, file)),
  );
}

function runCommand(label, args, options) {
  if (options?.inherit) {
    process.stderr.write(`\npre-commit: ${label}\n`);
  }
  const result = spawnSync('pnpm', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env,
    shell: true,
    stdio: options?.inherit ? 'inherit' : 'pipe',
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
  });
  const output = [result.stdout, result.stderr, result.error?.message]
    .filter(Boolean)
    .join('\n');
  if (result.status === 0) {
    return null;
  }
  return {
    script: label,
    code: result.status ?? 1,
    output,
  };
}

/** Prettier + ESLint on staged paths only (repo-wide `format:check` is not a commit gate). */
export function runStagedLintChecks(options) {
  const failures = [];
  const prettierTargets = stagedExistingFiles(PRETTIER_FILE);
  if (prettierTargets.length > 0) {
    const failure = runCommand(
      `prettier --check (${prettierTargets.length} staged file(s))`,
      ['exec', 'prettier', '--check', ...prettierTargets],
      options,
    );
    if (failure) failures.push(failure);
  }

  const eslintTargets = stagedExistingFiles(ESLINT_FILE);
  if (eslintTargets.length > 0) {
    const failure = runCommand(
      `eslint (${eslintTargets.length} staged file(s))`,
      ['exec', 'eslint', '--max-warnings', '0', ...eslintTargets],
      options,
    );
    if (failure) failures.push(failure);
  }

  return failures;
}

function tail(text) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const lines = trimmed.split(/\r?\n/).slice(-40).join('\n');
  return lines.length <= 4000 ? lines : lines.slice(-4000);
}

export function runPnpm(script, { inherit = false } = {}) {
  const result = spawnSync('pnpm', [script], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env,
    shell: true,
    stdio: inherit ? 'inherit' : 'pipe',
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
  });
  const output = [result.stdout, result.stderr, result.error?.message]
    .filter(Boolean)
    .join('\n');
  return {
    script,
    code: result.status === 0 ? 0 : (result.status ?? 1),
    output,
  };
}

export function runCheck(checkName, options) {
  const check = CHECKS[checkName];
  const failures = [];
  for (const script of check.scripts) {
    if (options?.inherit) {
      process.stderr.write(`\npre-commit: pnpm ${script}\n`);
    }
    const result = runPnpm(script, options);
    if (result.code !== 0) {
      failures.push(result);
      if (check.stopOnFailure) break;
    }
  }
  return failures;
}

export function formatFailures(failures) {
  return failures
    .map((failure) => {
      const header = `${failure.script} failed (exit ${failure.code}).`;
      const body = tail(failure.output);
      return body ? `${header}\n${body}` : header;
    })
    .join('\n\n');
}
