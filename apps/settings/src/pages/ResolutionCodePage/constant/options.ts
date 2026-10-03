import type { SelectOption } from '@cms/ui';

export const RESOLUTION_CODE_PAGE_SIZE = 10;

/**
 * The Setup swagger exposes only `gloResolutionTypeId` (no type lookup or
 * name), so the labels shown in the Figma Type column live here.
 */
export const RESOLUTION_TYPE_OPTIONS: readonly SelectOption[] = [
  { value: '1', label: 'Complete' },
  { value: '2', label: 'Part Ordered' },
  { value: '3', label: 'Not Home' },
  { value: '4', label: 'General Resolution' },
  { value: '5', label: 'Incomplete' },
  { value: '6', label: 'Technical Resolution' },
];
