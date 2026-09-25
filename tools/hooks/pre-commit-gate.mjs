#!/usr/bin/env node
/**
 * Gates `git commit` for Cursor (`beforeShellExecution`) and Claude Code
 * (`PreToolUse`). Stdout is only the hook decision JSON. Check logs stay in
 * the deny message.
 *
 *   node tools/hooks/pre-commit-gate.mjs <cursor|claude> <build|lint>
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

const CHECKS = {
  build: {
    scripts: ['build', 'pages:build'],
    stopOnFailure: true,
  },
  lint: {
    scripts: ['format:check', 'lint'],
    stopOnFailure: false,
  },
};

const host = process.argv[2];
const checkName = process.argv[3];

function readCommand() {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    input = {};
  }
  const toolInput = input.tool_input ?? {};
  const value = input.command ?? toolInput.command ?? '';
  return typeof value === 'string' ? value : '';
}

function isGitCommit(command) {
  return command.split(/&&|\|\||;|\r?\n/).some((segment) => {
    const trimmed = segment.trim();
    if (!/\bgit(?:\.exe)?\s+(?:-[cC]\s+\S+\s+)*commit(?!-)/.test(trimmed)) {
      return false;
    }
    if (/(?:^|\s)--dry-run(?:\s|=|$)/.test(trimmed)) return false;
    if (/(?:^|\s)--help(?:\s|$)/.test(trimmed)) return false;
    return true;
  });
}

function tail(text) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const lines = trimmed.split(/\r?\n/).slice(-40).join('\n');
  return lines.length <= 4000 ? lines : lines.slice(-4000);
}

function runPnpm(script) {
  const result = spawnSync('pnpm', [script], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: process.env,
    shell: true,
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

function denyText(failures) {
  return failures
    .map((failure) => {
      const header = `pnpm ${failure.script} failed (exit ${failure.code}).`;
      const body = tail(failure.output);
      return body ? `${header}\n${body}` : header;
    })
    .join('\n\n');
}

function emit(decision) {
  if (decision === 'allow' && host === 'claude') {
    process.exit(0);
  }
  if (decision === 'allow') {
    process.stdout.write(`${JSON.stringify({ permission: 'allow' })}\n`);
    process.exit(0);
  }
  if (host === 'claude') {
    process.stdout.write(
      `${JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: decision,
        },
      })}\n`,
    );
    process.exit(0);
  }
  process.stdout.write(
    `${JSON.stringify({
      permission: 'deny',
      user_message: decision.split('\n')[0],
      agent_message: decision,
    })}\n`,
  );
  process.exit(0);
}

if (host !== 'cursor' && host !== 'claude') {
  process.stderr.write(
    'pre-commit-gate: host must be "cursor" or "claude".\n',
  );
  process.exit(2);
}

const check = CHECKS[checkName];
if (!check) {
  emit(
    `pre-commit-gate: check must be "build" or "lint" (got ${checkName ?? 'nothing'}).`,
  );
}

const command = readCommand();
if (!isGitCommit(command)) {
  emit('allow');
}

const failures = [];
for (const script of check.scripts) {
  const result = runPnpm(script);
  if (result.code !== 0) {
    failures.push(result);
    if (check.stopOnFailure) break;
  }
}

if (failures.length === 0) {
  emit('allow');
}

emit(denyText(failures));
