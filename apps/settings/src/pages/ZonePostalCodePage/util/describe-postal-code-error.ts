import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed postal code load or save. */
export function describePostalCodeError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to postal codes.";
      case 404:
        return 'Postal code not found.';
      case 409:
        return 'This postal code was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Postal code data came back in an unexpected format.';
  }
  return 'The postal code service is unreachable. Check your connection and try again.';
}
