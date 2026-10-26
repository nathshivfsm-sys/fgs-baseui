import { ApiError } from '@cms/shared-api';
import { describeCatalogError } from '../../../util/describe-catalog-error';

export const describeCustomerError = (error: unknown) =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change customers.',
    notFound: 'That customer could not be found.',
    conflict: 'This customer could not be saved because of a conflict.',
    invalid: 'The customer request was invalid.',
    unreachable: 'The customer service is unavailable.',
    defaultMessage:
      error instanceof ApiError
        ? error.message
        : 'Something went wrong while loading customers.',
  });
