import { describeCatalogError } from '../../../shared';
import { LOAD_TAGS_ERROR_TITLE } from '../constant';

export const describeTagError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: 'You do not have permission to manage tags.',
    notFound: 'The tag was not found.',
    conflict: 'A tag with this name already exists for the selected entity.',
    invalid: 'The tag response was invalid.',
    unreachable: LOAD_TAGS_ERROR_TITLE,
  });
