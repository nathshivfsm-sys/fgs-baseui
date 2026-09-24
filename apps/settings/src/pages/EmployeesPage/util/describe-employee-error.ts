import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

export const describeEmployeeError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to employee management.";
      case 404:
        return 'Employee not found.';
      case 409:
        return 'This employee record was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Employee data came back in an unexpected format.';
  }
  return 'The employee service is unreachable. Check your connection and try again.';
};
