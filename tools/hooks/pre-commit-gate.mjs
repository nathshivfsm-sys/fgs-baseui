#!/usr/bin/env node
/**
 * Gates `git commit` for Cursor (`beforeShellExecution`) and Claude Code
 * (`PreToolUse`). Stdout is only the hook decision JSON. Check logs stay in
 * the deny message.
 *
 *   node tools/hooks/pre-commit-gate.mjs <cursor|claude> <build|lint>
 */
import { readFileSync } from 'node:fs';
import {
  CHECKS,
  formatFailures,
  runCheck,
  runStagedLintChecks,
} from './pre-commit-checks.mjs';

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
  process.stderr.write('pre-commit-gate: host must be "cursor" or "claude".\n');
  process.exit(2);
}

if (checkName !== 'build' && checkName !== 'lint') {
  emit(
    `pre-commit-gate: check must be "build" or "lint" (got ${checkName ?? 'nothing'}).`,
  );
}

const command = readCommand();
if (!isGitCommit(command)) {
  emit('allow');
}

const failures =
  checkName === 'lint' ? runStagedLintChecks() : runCheck(checkName);

if (failures.length === 0) {
  emit('allow');
}

emit(formatFailures(failures));
