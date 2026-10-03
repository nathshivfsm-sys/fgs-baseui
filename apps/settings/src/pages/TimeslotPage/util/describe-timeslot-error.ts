import { describeCatalogError } from '../../../shared';

export const describeTimeslotError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You cannot change this time slot.',
    notFound: 'Time slot not found.',
    conflict: 'A time slot with this code already exists for your company.',
    invalid: 'Time slot data came back in an unexpected format.',
    unreachable:
      'The time slot service is unreachable. Check your connection and try again.',
  });
