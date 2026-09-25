import { ApiError } from '@cms/shared-api';
import { ZodError } from 'zod';
import type { CatalogErrorCopy } from '../types';

const SESSION_EXPIRED = 'Your session has expired. Sign in again.';

/**
 * Maps a catalog load/save failure to user-facing copy. Callers supply only
 * the lines that name their resource.
 */
export const describeCatalogError = (
  error: unknown,
  copy: CatalogErrorCopy,
): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return SESSION_EXPIRED;
      case 403:
        return copy.forbidden;
      case 404:
        return copy.notFound;
      case 405:
        return copy.methodNotAllowed ?? error.message;
      case 409:
        return copy.conflict;
      default:
        return error.message;
    }
  }
  if (error instanceof ZodError) return copy.invalid;
  return copy.unreachable;
};
