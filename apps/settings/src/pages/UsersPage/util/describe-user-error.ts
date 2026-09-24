import { describeCatalogError } from '../../../shared';

export const describeUserError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to user management.",
    notFound: 'User not found.',
    conflict: 'This user record was updated by another user.',
    invalid: 'User data came back in an unexpected format.',
    unreachable:
      'The user service is unreachable. Check your connection and try again.',
  });
