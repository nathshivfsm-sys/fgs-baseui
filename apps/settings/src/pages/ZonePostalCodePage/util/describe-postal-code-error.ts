import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed postal code load or save. */
export const describePostalCodeError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to postal codes.",
    notFound: 'Postal code not found.',
    conflict: 'This postal code was updated by another user.',
    invalid: 'Postal code data came back in an unexpected format.',
    unreachable:
      'The postal code service is unreachable. Check your connection and try again.',
  });
