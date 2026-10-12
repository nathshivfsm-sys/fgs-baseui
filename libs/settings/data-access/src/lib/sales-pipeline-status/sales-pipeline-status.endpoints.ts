import type { SalesPipelineStatusListParams } from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const salesPipelineStatusCollectionEndpoint = '/salespipelinestatus';

export function salesPipelineStatusListEndpoint(
  params: SalesPipelineStatusListParams = {},
): string {
  return `${salesPipelineStatusCollectionEndpoint}${toSearchParams(params)}`;
}

export function salesPipelineStatusDetailEndpoint(id: number): string {
  return `${salesPipelineStatusCollectionEndpoint}/${id}`;
}

export function salesPipelineStatusLookupEndpoint(activeOnly = true): string {
  return `${salesPipelineStatusCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}
