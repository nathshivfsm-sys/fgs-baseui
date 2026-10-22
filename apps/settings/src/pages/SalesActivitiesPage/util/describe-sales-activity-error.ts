import { describeCatalogError } from '../../../shared';

export const describeSalesActivityError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change sales activities.',
    notFound: 'Sales activity not found.',
    conflict:
      'A sales activity with this code already exists for your company.',
    invalid: 'Sales activity data came back in an unexpected format.',
    unreachable:
      'The sales activity service is unreachable. Check your connection and try again.',
  });

export const describeSalesActivityOutcomeError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden:
      'You do not have permission to view or change activity outcomes.',
    notFound: 'Activity outcome not found.',
    conflict:
      'An activity outcome with this code already exists for your company.',
    invalid: 'Activity outcome data came back in an unexpected format.',
    unreachable:
      'The activity outcome service is unreachable. Check your connection and try again.',
  });
