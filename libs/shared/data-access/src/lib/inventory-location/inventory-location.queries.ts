import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  inventoryLocationLookupResponseSchema,
  type InventoryLocationLookupDto,
  type InventoryLocationLookupParams,
} from '@cms/shared-contract';
import { inventoryLocationLookupEndpoint } from './inventory-location.endpoints';
import { inventoryLocationKeys } from './inventory-location.keys';

export const loadInventoryLocationLookup = async (
  params: InventoryLocationLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly InventoryLocationLookupDto[]> => {
  const body = await customFetch<unknown>(
    inventoryLocationLookupEndpoint(params),
    { signal },
  );
  return inventoryLocationLookupResponseSchema.parse(body).data;
};

export const inventoryLocationLookupQueryOptions = (
  params: InventoryLocationLookupParams = {},
) =>
  queryOptions({
    queryKey: inventoryLocationKeys.lookup(params),
    queryFn: ({ signal }) => loadInventoryLocationLookup(params, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'inventory-location', operation: 'lookup' },
  });
