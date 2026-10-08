import { describeCatalogError } from '../../../shared';

export const describeStandardDescriptionError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You cannot change this standard description.',
    notFound: 'Standard description not found.',
    conflict: 'A standard description with this title already exists.',
    invalid: 'Standard description data came back in an unexpected format.',
    unreachable:
      'The standard description service is unreachable. Check your connection and try again.',
  });
