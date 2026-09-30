import type {
  JobTypeCountsParams,
  JobTypeListParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const jobTypeCollectionEndpoint = '/jobtype';

export function jobTypeListEndpoint(params: JobTypeListParams = {}): string {
  return `${jobTypeCollectionEndpoint}${toSearchParams(params)}`;
}

export function jobTypeDetailEndpoint(id: number): string {
  return `${jobTypeCollectionEndpoint}/${id}`;
}

export function jobTypeLookupEndpoint(activeOnly = true): string {
  return `${jobTypeCollectionEndpoint}/lookup${toSearchParams({ activeOnly })}`;
}

export function jobTypeCountsEndpoint(
  params: JobTypeCountsParams = {},
): string {
  return `${jobTypeCollectionEndpoint}/counts${toSearchParams(params)}`;
}
