import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed skill load or save. */
export const describeSkillError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to skills.",
    notFound: 'Skill not found.',
    methodNotAllowed: 'This environment does not support deleting skills.',
    conflict: 'This skill was updated by another user.',
    invalid: 'Skill data came back in an unexpected format.',
    unreachable:
      'The skill service is unreachable. Check your connection and try again.',
  });
