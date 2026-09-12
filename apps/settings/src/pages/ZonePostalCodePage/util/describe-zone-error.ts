import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';

/** User-facing copy for a failed zone load or save. */
export function describeZoneError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Sign in again.';
      case 403:
        return "You don't have access to zones.";
      case 404:
        return 'Zone not found.';
      case 409:
        return 'This zone was updated by another user.';
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) {
    return 'Zone data came back in an unexpected format.';
  }
  return 'The zone service is unreachable. Check your connection and try again.';
}
