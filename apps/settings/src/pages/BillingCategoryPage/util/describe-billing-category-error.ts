import { describeCatalogError } from '../../../shared';

export const describeBillingCategoryError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden:
      'You cannot change this billing category. System defined categories cannot be edited or deactivated.',
    notFound: 'Billing category not found.',
    conflict:
      'A billing category with this type and name already exists for your company.',
    invalid: 'Billing category data came back in an unexpected format.',
    unreachable:
      'The billing category service is unreachable. Check your connection and try again.',
  });
