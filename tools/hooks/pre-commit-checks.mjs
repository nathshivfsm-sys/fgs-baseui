import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

/** Keep pre-commit builds from spawning every MFE vite build at once (OOM on Windows). */
function preCommitBuildEnv() {
  const nodeOptions = [
    process.env.NODE_OPTIONS,
    '--max-old-space-size=8192',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  return {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
    NX_PARALLEL: process.env.NX_PARALLEL ?? '2',
  };
}

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

/** Avoid Windows "command line is too long" when linting hundreds of staged paths. */
const STAGED_LINT_CHUNK_SIZE = 40;

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
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

function runStagedToolInChunks(
  toolName,
  toolArgsPrefix,
  targets,
  options,
) {
  const failures = [];
  const chunks = chunkArray(targets, STAGED_LINT_CHUNK_SIZE);
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const chunkLabel =
      chunks.length > 1
        ? `${toolName} (${chunk.length} staged file(s), batch ${index + 1}/${chunks.length})`
        : `${toolName} (${chunk.length} staged file(s))`;
    const failure = runCommand(
      chunkLabel,
      ['exec', ...toolArgsPrefix, ...chunk],
      options,
    );
    if (failure) failures.push(failure);
  }
  return failures;
}

/** Prettier on staged paths (optional ESLint when PRE_COMMIT_ESLINT=1). */
export function runStagedLintChecks(options) {
  const failures = [];
  const prettierTargets = stagedExistingFiles(PRETTIER_FILE);
  if (prettierTargets.length > 0) {
    failures.push(
      ...runStagedToolInChunks(
        'prettier --check',
        ['prettier', '--check'],
        prettierTargets,
        options,
      ),
    );
  }

  // Off by default: root `pnpm exec eslint` needs the `eslint` package (use nx lint in CI).
  // Re-enable locally with PRE_COMMIT_ESLINT=1 once eslint is on the root devDependencies.
  const eslintTargets = stagedExistingFiles(ESLINT_FILE);
  if (process.env.PRE_COMMIT_ESLINT === '1' && eslintTargets.length > 0) {
    failures.push(
      ...runStagedToolInChunks(
        'eslint',
        ['eslint', '--max-warnings', '0'],
        eslintTargets,
        options,
      ),
    );
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
  const env =
    script === 'build' || script === 'pages:build'
      ? preCommitBuildEnv()
      : process.env;
  const result = spawnSync('pnpm', [script], {
    cwd: repoRoot,
    encoding: 'utf8',
    env,
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
