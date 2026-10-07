import type { InventoryLocationLookupParams } from '@cms/shared-contract';
import { toSearchParams } from '../util';

export const inventoryLocationLookupCollectionEndpoint =
  '/inventorylocation/lookup';

export function inventoryLocationLookupEndpoint(
  params: InventoryLocationLookupParams = {},
): string {
  return `${inventoryLocationLookupCollectionEndpoint}${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    locationType: params.locationType,
  })}`;
}
