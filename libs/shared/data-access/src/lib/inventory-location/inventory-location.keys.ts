import type { InventoryLocationLookupParams } from '@cms/shared-contract';

export const inventoryLocationKeys = {
  all: ['inventory-location'] as const,
  lookups: () => [...inventoryLocationKeys.all, 'lookup'] as const,
  lookup: (params: InventoryLocationLookupParams) =>
    [...inventoryLocationKeys.lookups(), params] as const,
} as const;
