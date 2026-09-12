import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed non-working-day load or write. */
export function describeNonWorkingDateError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to non-working days.";
      case 404:
        return 'Non-working day not found.';
      case 409:
        return 'This non-working day was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Non-working days came back in an unexpected format.';
  }
  return 'The non-working day service is unreachable. Check your connection and try again.';
}
