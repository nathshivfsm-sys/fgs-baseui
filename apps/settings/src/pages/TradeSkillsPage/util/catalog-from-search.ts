import type { TradeCatalog } from '../types';

export const catalogFromSearch = (value: string | null): TradeCatalog =>
  value === 'skills' ? 'skills' : 'trade';
