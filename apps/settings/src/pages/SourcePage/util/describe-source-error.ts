import { describeCatalogError } from '../../../shared';

export const describeSourceError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to view or change sources.',
    notFound: 'Source not found.',
    conflict: 'A source with this name already exists for your company.',
    invalid: 'Source data came back in an unexpected format.',
    unreachable:
      'The source service is unreachable. Check your connection and try again.',
  });
