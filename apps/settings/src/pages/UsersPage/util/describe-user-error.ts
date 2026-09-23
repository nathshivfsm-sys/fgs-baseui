import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

export const describeUserError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to user management.";
      case 404:
        return 'User not found.';
      case 409:
        return 'This user record was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'User data came back in an unexpected format.';
  }
  return 'The user service is unreachable. Check your connection and try again.';
};
