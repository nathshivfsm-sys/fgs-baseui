import { describeCatalogError } from '../../../util/describe-catalog-error';

export const describeCreateServiceLocationError = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return describeCatalogError(error, {
    forbidden: 'You do not have permission to create a service location.',
    notFound: 'This customer is no longer available.',
    conflict:
      'The service location could not be created because of a conflict.',
    invalid: 'The service location request was invalid.',
    unreachable: 'The customer service is unavailable.',
    defaultMessage: 'Something went wrong while creating the service location.',
  });
};
