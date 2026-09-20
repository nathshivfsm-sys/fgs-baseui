import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed skill load or save. */
export const describeSkillError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to skills.";
      case 404:
        return 'Skill not found.';
      case 405:
        return 'This environment does not support deleting skills.';
      case 409:
        return 'This skill was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Skill data came back in an unexpected format.';
  }
  return 'The skill service is unreachable. Check your connection and try again.';
};
