import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed business-type load or enable. */
export const describeBusinessTypeError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to business types.",
    notFound: 'Business type not found.',
    conflict: 'This business type was updated by another user.',
    invalid: 'Business type data came back in an unexpected format.',
    unreachable:
      'The business type service is unreachable. Check your connection and try again.',
  });
