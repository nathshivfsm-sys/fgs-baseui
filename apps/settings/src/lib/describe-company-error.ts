import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed company load or save. */
export function describeCompanyError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to this company's settings.";
      case 404:
        return 'Company not found.';
      case 409:
        return 'Settings already updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Company details came back in an unexpected format.';
  }
  return 'The company service is unreachable. Check your connection and try again.';
}
