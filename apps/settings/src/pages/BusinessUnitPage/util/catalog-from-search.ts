import type { BusinessUnitCatalog } from '../types';
import {
  BREAK_TWO_BREAK_LEVEL,
  BUSINESS_UNIT_BREAK_LEVEL,
} from '../constant';

export const catalogFromSearch = (value: string | null): BusinessUnitCatalog =>
  value === 'break2' ? 'break-2' : 'business-units';

export const breakLevelForCatalog = (catalog: BusinessUnitCatalog): number =>
  catalog === 'break-2' ? BREAK_TWO_BREAK_LEVEL : BUSINESS_UNIT_BREAK_LEVEL;
