import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  paymentTermDetailResponseSchema,
  paymentTermListResponseSchema,
  paymentTermLookupResponseSchema,
  type PagedResult,
  type PaymentTermDetailDto,
  type PaymentTermListParams,
  type PaymentTermLookupDto,
  type PaymentTermSummaryDto,
} from '@cms/shared-contract';
import { toPagedResult } from '../util';
import {
  paymentTermDetailEndpoint,
  paymentTermListEndpoint,
  paymentTermLookupEndpoint,
} from './payment-term.endpoints';
import { paymentTermKeys } from './payment-term.keys';

export const loadPaymentTerms = async (
  params: PaymentTermListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PaymentTermSummaryDto>> => {
  const body = await customFetch<unknown>(paymentTermListEndpoint(params), {
    signal,
  });
  return toPagedResult(paymentTermListResponseSchema.parse(body).data);
};

export const loadPaymentTerm = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PaymentTermDetailDto> => {
  const body = await customFetch<unknown>(paymentTermDetailEndpoint(id), {
    signal,
  });
  return paymentTermDetailResponseSchema.parse(body).data;
};

export const loadPaymentTermLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly PaymentTermLookupDto[]> => {
  const body = await customFetch<unknown>(
    paymentTermLookupEndpoint(activeOnly),
    { signal },
  );
  return paymentTermLookupResponseSchema.parse(body).data;
};

export const paymentTermListQueryOptions = (
  params: PaymentTermListParams = {},
) =>
  queryOptions({
    queryKey: paymentTermKeys.list(params),
    queryFn: ({ signal }) => loadPaymentTerms(params, { signal }),
    meta: { feature: 'payment-term', operation: 'list' },
  });

export const paymentTermDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: paymentTermKeys.detail(id),
    queryFn: ({ signal }) => loadPaymentTerm(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'payment-term', operation: 'detail' },
  });

export const paymentTermLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: paymentTermKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadPaymentTermLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'payment-term', operation: 'lookup' },
  });
