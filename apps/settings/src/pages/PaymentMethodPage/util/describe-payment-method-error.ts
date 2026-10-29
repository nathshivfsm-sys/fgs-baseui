import { describeCatalogError } from '../../../shared';

export const describePaymentMethodError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change payment methods.',
    notFound: 'Payment method not found.',
    conflict: 'Payment method name already exists.',
    invalid: 'Payment method data came back in an unexpected format.',
    unreachable:
      'The payment method service is unreachable. Check your connection and try again.',
  });
