import { describeCatalogError } from '../../../shared';

/** User-facing copy for a failed company load or save. */
export const describeCompanyError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to this company's settings.",
    notFound: 'Company not found.',
    conflict: 'Settings already updated by another user.',
    invalid: 'Company details came back in an unexpected format.',
    unreachable:
      'The company service is unreachable. Check your connection and try again.',
  });
