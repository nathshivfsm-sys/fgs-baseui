import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed tax authority or tax-code load or save. */
export const describeTaxError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to tax setup.",
    notFound: 'Tax record not found.',
    conflict: 'This tax record was updated by another user.',
    invalid: 'Tax data came back in an unexpected format.',
    unreachable:
      'The tax service is unreachable. Check your connection and try again.',
  });
