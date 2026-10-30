import { describeCatalogError } from '../../../shared';

export const describePricebookError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change services.',
    notFound: 'Service not found.',
    conflict: 'A service with this code already exists.',
    invalid: 'Service data came back in an unexpected format.',
    unreachable:
      'The price book service is unreachable. Check your connection and try again.',
  });

export const describePricebookItemError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to change service lines.',
    notFound: 'Service line not found.',
    conflict: 'A line with this name already exists on the service.',
    invalid: 'Service line data came back in an unexpected format.',
    unreachable:
      'The price book service is unreachable. Check your connection and try again.',
  });
