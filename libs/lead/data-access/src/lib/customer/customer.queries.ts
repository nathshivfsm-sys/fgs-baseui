import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  customerDetailResponseSchema,
  customerListResponseSchema,
  customerLookupResponseSchema,
  type CustomerDetailDto,
  type CustomerListParams,
  type CustomerListResult,
  type CustomerLookupDto,
} from '@cms/lead-contract';
import { toPagedResult } from '../util';
import {
  customerDetailEndpoint,
  customerListEndpoint,
  customerLookupEndpoint,
} from './customer.endpoints';
import { customerKeys } from './customer.keys';

export const loadCustomers = async (
  params: CustomerListParams,
  { signal }: QueryRequestContext,
): Promise<CustomerListResult> => {
  const body = await customFetch<unknown>(customerListEndpoint(params), {
    signal,
  });
  const data = customerListResponseSchema.parse(body).data;
  return {
    ...toPagedResult(data),
    summary: data.summary ?? null,
  };
};

export const loadCustomer = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<CustomerDetailDto> => {
  const body = await customFetch<unknown>(customerDetailEndpoint(id), {
    signal,
  });
  return customerDetailResponseSchema.parse(body).data;
};

export const loadCustomerLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly CustomerLookupDto[]> => {
  const body = await customFetch<unknown>(customerLookupEndpoint(activeOnly), {
    signal,
  });
  return customerLookupResponseSchema.parse(body).data;
};

export const customerListQueryOptions = (params: CustomerListParams = {}) =>
  queryOptions({
    queryKey: customerKeys.list(params),
    queryFn: ({ signal }) => loadCustomers(params, { signal }),
    meta: { feature: 'customer', operation: 'list' },
  });

export const customerDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: customerKeys.detail(id),
    queryFn: ({ signal }) => loadCustomer(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'customer', operation: 'detail' },
  });

export const customerLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: customerKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadCustomerLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'customer', operation: 'lookup' },
  });
