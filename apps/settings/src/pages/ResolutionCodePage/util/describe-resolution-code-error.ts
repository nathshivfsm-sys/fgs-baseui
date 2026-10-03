import { describeCatalogError } from '../../../shared';

export const describeResolutionCodeError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You cannot change this resolution code.',
    notFound: 'Time slot not found.',
    conflict:
      'A resolution code with this code already exists for your company.',
    invalid: 'Time slot data came back in an unexpected format.',
    unreachable:
      'The resolution code service is unreachable. Check your connection and try again.',
  });
