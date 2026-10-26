import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  customerDetailResponseSchema,
  customerFinancialSummaryResponseSchema,
  customerListResponseSchema,
  customerLookupResponseSchema,
  type CustomerDetailDto,
  type CustomerFinancialSummaryDto,
  type CustomerListParams,
  type CustomerListResult,
  type CustomerLookupDto,
} from '@cms/customer-contract';
import { toPagedResult } from '../util';
import {
  customerDetailEndpoint,
  customerFinancialSummaryEndpoint,
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

export const loadCustomerFinancialSummary = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<CustomerFinancialSummaryDto> => {
  const body = await customFetch<unknown>(
    customerFinancialSummaryEndpoint(id),
    { signal },
  );
  return customerFinancialSummaryResponseSchema.parse(body).data;
};

export const customerFinancialSummaryQueryOptions = (id: number) =>
  queryOptions({
    queryKey: customerKeys.financialSummary(id),
    queryFn: ({ signal }) => loadCustomerFinancialSummary(id, { signal }),
    staleTime: 60 * 1000,
    meta: { feature: 'customer', operation: 'financial-summary' },
  });

export const customerLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: customerKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadCustomerLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'customer', operation: 'lookup' },
  });
