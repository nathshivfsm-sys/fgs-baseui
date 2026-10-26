import { describeCatalogError } from '../../../util/describe-catalog-error';

export const describeCreateCustomerError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to create customers.',
    notFound: 'Customer could not be found.',
    conflict: 'A customer with this information already exists.',
    invalid: 'Check the form and try again.',
    unreachable: 'Customer service is temporarily unavailable.',
    defaultMessage: 'Something went wrong while creating the customer.',
  });
