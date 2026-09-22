import type { JobTypeCatalog } from '../types';

export function catalogFromSearch(value: string | null): JobTypeCatalog {
  return value === 'job-type' ? 'job-type' : 'category';
}
