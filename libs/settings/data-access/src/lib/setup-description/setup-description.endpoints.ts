import type {
  SetupDescriptionListParams,
  SetupDescriptionLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const setupDescriptionCollectionEndpoint = '/setupdescription';

export function setupDescriptionListEndpoint(
  params: SetupDescriptionListParams = {},
): string {
  return `${setupDescriptionCollectionEndpoint}${toSearchParams(params)}`;
}

export function setupDescriptionDetailEndpoint(id: number): string {
  return `${setupDescriptionCollectionEndpoint}/${id}`;
}

export function setupDescriptionLookupEndpoint(
  params: SetupDescriptionLookupParams = {},
): string {
  return `${setupDescriptionCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
  })}`;
}
