import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed GL break load or save. */
export const describeGlBreakError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to business units.",
    notFound: 'Record not found.',
    conflict: 'This record was updated by another user.',
    invalid: 'Business unit data came back in an unexpected format.',
    unreachable:
      'The catalog service is unreachable. Check your connection and try again.',
  });
