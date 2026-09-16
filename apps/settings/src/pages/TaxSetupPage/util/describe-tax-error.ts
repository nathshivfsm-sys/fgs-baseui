import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed tax authority or tax-code load or save. */
export function describeTaxError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to tax setup.";
      case 404:
        return 'Tax record not found.';
      case 409:
        return 'This tax record was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Tax data came back in an unexpected format.';
  }
  return 'The tax service is unreachable. Check your connection and try again.';
}
