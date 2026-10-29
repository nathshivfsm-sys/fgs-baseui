import { describeCatalogError } from '../../../shared';

export const describePaymentTermError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change payment terms.',
    notFound: 'Payment term not found.',
    conflict: 'Payment term name already exists.',
    invalid: 'Payment term data came back in an unexpected format.',
    unreachable:
      'The payment term service is unreachable. Check your connection and try again.',
  });
