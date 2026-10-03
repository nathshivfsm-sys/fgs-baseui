import type {
  ResolutionCodeListParams,
  ResolutionCodeLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const resolutionCodeCollectionEndpoint = '/resolutioncode';

export function resolutionCodeListEndpoint(
  params: ResolutionCodeListParams = {},
): string {
  return `${resolutionCodeCollectionEndpoint}${toSearchParams(params)}`;
}

export function resolutionCodeDetailEndpoint(id: number): string {
  return `${resolutionCodeCollectionEndpoint}/${id}`;
}

export function resolutionCodeLookupEndpoint(
  params: ResolutionCodeLookupParams = {},
): string {
  return `${resolutionCodeCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    isMobileVisible: params.isMobileVisible,
  })}`;
}
