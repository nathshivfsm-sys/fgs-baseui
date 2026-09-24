import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed non-working-day load or write. */
export const describeNonWorkingDateError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to non-working days.",
    notFound: 'Non-working day not found.',
    conflict: 'This non-working day was updated by another user.',
    invalid: 'Non-working days came back in an unexpected format.',
    unreachable:
      'The non-working day service is unreachable. Check your connection and try again.',
  });
