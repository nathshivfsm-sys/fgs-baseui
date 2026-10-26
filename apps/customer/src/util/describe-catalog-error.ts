import { ApiError } from '@cms/shared-api';

type CatalogErrorCopy = {
  forbidden: string;
  notFound: string;
  conflict: string;
  invalid: string;
  unreachable: string;
  defaultMessage: string;
};

export const describeCatalogError = (
  error: unknown,
  copy: CatalogErrorCopy,
): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return copy.forbidden;
      case 404:
        return copy.notFound;
      case 409:
        return copy.conflict;
      case 422:
        return copy.invalid;
      case 502:
      case 503:
      case 504:
        return copy.unreachable;
      default:
        return error.message || copy.defaultMessage;
    }
  }
  return copy.defaultMessage;
};
