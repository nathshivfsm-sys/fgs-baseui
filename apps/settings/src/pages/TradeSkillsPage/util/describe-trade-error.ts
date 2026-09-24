import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed trade load or save. */
export const describeTradeError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to trades.",
    notFound: 'Trade not found.',
    methodNotAllowed: 'This environment does not support deleting trades.',
    conflict: 'This trade was updated by another user.',
    invalid: 'Trade data came back in an unexpected format.',
    unreachable:
      'The trade service is unreachable. Check your connection and try again.',
  });
