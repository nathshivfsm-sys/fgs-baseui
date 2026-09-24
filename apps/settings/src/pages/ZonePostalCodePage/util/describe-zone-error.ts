import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed zone load or save. */
export const describeZoneError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to zones.",
    notFound: 'Zone not found.',
    conflict: 'This zone was updated by another user.',
    invalid: 'Zone data came back in an unexpected format.',
    unreachable:
      'The zone service is unreachable. Check your connection and try again.',
  });
