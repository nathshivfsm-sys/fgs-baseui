import type { SelectOption } from '@cms/ui';
import {
  LABOR_BURDEN_TYPE_FIXED,
  LABOR_BURDEN_TYPE_PERCENTAGE,
  START_LOCATION_HOME,
  START_LOCATION_OFFICE,
} from '@cms/settings-data-access';

export const LABOR_BURDEN_TYPE_OPTIONS: readonly SelectOption[] = [
  { label: 'Percentage', value: String(LABOR_BURDEN_TYPE_PERCENTAGE) },
  { label: 'Fixed', value: String(LABOR_BURDEN_TYPE_FIXED) },
];

export const START_LOCATION_TYPE_OPTIONS: readonly SelectOption[] = [
  { label: 'Office', value: String(START_LOCATION_OFFICE) },
  { label: 'Home', value: String(START_LOCATION_HOME) },
];
