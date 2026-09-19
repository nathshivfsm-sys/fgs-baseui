import type { TaxCatalog } from '../types';

export function catalogFromSearch(value: string | null): TaxCatalog {
  return value === 'tax-code' ? 'tax-code' : 'authorities';
}
