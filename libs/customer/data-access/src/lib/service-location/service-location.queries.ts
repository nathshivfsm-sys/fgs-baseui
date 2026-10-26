import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  serviceLocationDetailResponseSchema,
  serviceLocationListResponseSchema,
  type ServiceLocationDetailDto,
  type ServiceLocationListParams,
  type ServiceLocationListResult,
} from '@cms/customer-contract';
import { toPagedResult } from '../util';
import {
  customerServiceLocationDetailEndpoint,
  customerServiceLocationListEndpoint,
} from './service-location.endpoints';
import { serviceLocationKeys } from './service-location.keys';

export const loadServiceLocations = async (
  customerId: number,
  params: ServiceLocationListParams,
  { signal }: QueryRequestContext,
): Promise<ServiceLocationListResult> => {
  const body = await customFetch<unknown>(
    customerServiceLocationListEndpoint(customerId, params),
    { signal },
  );
  const data = serviceLocationListResponseSchema.parse(body).data;
  return {
    ...toPagedResult(data),
    summary: data.summary ?? null,
  };
};

export const loadServiceLocation = async (
  customerId: number,
  locationId: number,
  { signal }: QueryRequestContext,
): Promise<ServiceLocationDetailDto> => {
  const body = await customFetch<unknown>(
    customerServiceLocationDetailEndpoint(customerId, locationId),
    { signal },
  );
  return serviceLocationDetailResponseSchema.parse(body).data;
};

export const serviceLocationListQueryOptions = (
  customerId: number,
  params: ServiceLocationListParams = {},
) =>
  queryOptions({
    queryKey: serviceLocationKeys.list(customerId, params),
    queryFn: ({ signal }) =>
      loadServiceLocations(customerId, params, { signal }),
    meta: { feature: 'customer', operation: 'service-location-list' },
  });

export const serviceLocationDetailQueryOptions = (
  customerId: number,
  locationId: number,
) =>
  queryOptions({
    queryKey: serviceLocationKeys.detail(customerId, locationId),
    queryFn: ({ signal }) =>
      loadServiceLocation(customerId, locationId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'customer', operation: 'service-location-detail' },
  });
