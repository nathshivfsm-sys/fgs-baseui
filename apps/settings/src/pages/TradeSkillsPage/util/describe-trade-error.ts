import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed trade load or save. */
export const describeTradeError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to trades.";
      case 404:
        return 'Trade not found.';
      case 405:
        return 'This environment does not support deleting trades.';
      case 409:
        return 'This trade was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Trade data came back in an unexpected format.';
  }
  return 'The trade service is unreachable. Check your connection and try again.';
};
