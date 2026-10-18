import { describeCatalogError } from '../../../shared';

export const describeWorkOrderBookingError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden:
      'You do not have permission to view or change work order configuration.',
    notFound: 'Work order configuration was not found.',
    conflict:
      'Configuration was updated by someone else. Reload and try again.',
    invalid: 'Configuration values are invalid.',
    unreachable:
      'Work order configuration is unavailable. Check your connection and try again.',
  });
