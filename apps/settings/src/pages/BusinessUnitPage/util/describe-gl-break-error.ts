import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed GL break load or save. */
export const describeGlBreakError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to business units.";
      case 404:
        return 'Record not found.';
      case 409:
        return 'This record was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Business unit data came back in an unexpected format.';
  }
  return 'The catalog service is unreachable. Check your connection and try again.';
};
