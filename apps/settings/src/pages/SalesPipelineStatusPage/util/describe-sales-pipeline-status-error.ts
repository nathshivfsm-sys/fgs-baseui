import { describeCatalogError } from '../../../shared';

export const describeSalesPipelineStatusError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden:
      'You do not have permission to view or change sales pipeline statuses.',
    notFound: 'Sales pipeline status not found.',
    conflict:
      'A pipeline status with this code already exists for your company.',
    invalid: 'Sales pipeline status data came back in an unexpected format.',
    unreachable:
      'The sales pipeline status service is unreachable. Check your connection and try again.',
  });
