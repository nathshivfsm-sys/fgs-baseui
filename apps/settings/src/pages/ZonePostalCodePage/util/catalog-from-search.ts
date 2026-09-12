import type { ZoneCatalog } from '../types';

export function catalogFromSearch(value: string | null): ZoneCatalog {
  return value === 'postal' ? 'postal' : 'zones';
}
