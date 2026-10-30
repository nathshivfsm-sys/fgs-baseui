import type {
  PriceBookItemListParams,
  PriceBookItemLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const priceBookItemCollectionEndpoint = '/pricebookitem';

export function priceBookItemListEndpoint(
  params: PriceBookItemListParams = {},
): string {
  return `${priceBookItemCollectionEndpoint}${toSearchParams(params)}`;
}

export function priceBookItemDetailEndpoint(id: number): string {
  return `${priceBookItemCollectionEndpoint}/${id}`;
}

export function priceBookItemLookupEndpoint(
  params: PriceBookItemLookupParams = {},
): string {
  return `${priceBookItemCollectionEndpoint}/lookup${toSearchParams({
    priceBookId: params.priceBookId,
  })}`;
}
