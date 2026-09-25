#!/usr/bin/env node
/**
 * Git pre-commit hook for commits made outside Cursor and Claude Code.
 * Formatting and ESLint run first. The production builds run only after those pass.
 */
import {
  formatFailures,
  runCheck,
  runStagedLintChecks,
} from './pre-commit-checks.mjs';

const lintFailures = runStagedLintChecks({ inherit: true });
if (lintFailures.length > 0) {
  process.stderr.write(`\n${formatFailures(lintFailures)}\n`);
  process.stderr.write(
    '\nCommit blocked. Fix the formatting and ESLint errors, then commit again.\n',
  );
  process.exit(1);
}

const buildFailures = runCheck('build', { inherit: true });
if (buildFailures.length > 0) {
  process.stderr.write(`\n${formatFailures(buildFailures)}\n`);
  process.stderr.write(
    '\nCommit blocked. pnpm build and pnpm pages:build must pass.\n',
  );
  process.exit(1);
}
