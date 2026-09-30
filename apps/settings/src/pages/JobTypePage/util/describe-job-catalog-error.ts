import { describeCatalogError } from '../../../shared';

export const describeJobCategoryError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to job categories.",
    notFound: 'Job category not found.',
    conflict: 'This category was updated by another user.',
    invalid: 'Category data came back in an unexpected format.',
    unreachable:
      'The category service is unreachable. Check your connection and try again.',
  });

export const describeJobTypeError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to job types.",
    notFound: 'Job type not found.',
    conflict: 'This job type was updated by another user.',
    invalid: 'Job type data came back in an unexpected format.',
    unreachable:
      'The job type service is unreachable. Check your connection and try again.',
  });

export const describeSubcategoryError = (error: unknown): string =>
  describeCatalogError(error, {
    forbidden: "You don't have access to subcategories.",
    notFound: 'Subcategory not found.',
    conflict: 'This subcategory was updated by another user.',
    invalid: 'Subcategory data came back in an unexpected format.',
    unreachable:
      'The subcategory service is unreachable. Check your connection and try again.',
  });
