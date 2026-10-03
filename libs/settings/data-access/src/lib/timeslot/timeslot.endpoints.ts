import type {
  TimeslotListParams,
  TimeslotLookupParams,
} from '@cms/settings-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const timeslotCollectionEndpoint = '/timeslot';

export function timeslotListEndpoint(params: TimeslotListParams = {}): string {
  return `${timeslotCollectionEndpoint}${toSearchParams(params)}`;
}

export function timeslotDetailEndpoint(id: number): string {
  return `${timeslotCollectionEndpoint}/${id}`;
}

export function timeslotLookupEndpoint(
  params: TimeslotLookupParams = {},
): string {
  return `${timeslotCollectionEndpoint}/lookup${toSearchParams({
    activeOnly: params.activeOnly ?? true,
    isMobileVisible: params.isMobileVisible,
    isCustomerPortalVisible: params.isCustomerPortalVisible,
  })}`;
}
