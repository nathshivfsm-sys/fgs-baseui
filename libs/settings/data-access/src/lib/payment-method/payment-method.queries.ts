import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  paymentMethodDetailResponseSchema,
  paymentMethodListResponseSchema,
  paymentMethodLookupResponseSchema,
  type PagedResult,
  type PaymentMethodDetailDto,
  type PaymentMethodListParams,
  type PaymentMethodLookupDto,
  type PaymentMethodLookupParams,
  type PaymentMethodSummaryDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  paymentMethodDetailEndpoint,
  paymentMethodListEndpoint,
  paymentMethodLookupEndpoint,
} from './payment-method.endpoints';
import { paymentMethodKeys } from './payment-method.keys';

export const loadPaymentMethods = async (
  params: PaymentMethodListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<PaymentMethodSummaryDto>> => {
  const body = await customFetch<unknown>(paymentMethodListEndpoint(params), {
    signal,
  });
  return toPagedResult(paymentMethodListResponseSchema.parse(body).data);
};

export const loadPaymentMethod = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<PaymentMethodDetailDto> => {
  const body = await customFetch<unknown>(paymentMethodDetailEndpoint(id), {
    signal,
  });
  return paymentMethodDetailResponseSchema.parse(body).data;
};

export const loadPaymentMethodLookup = async (
  params: PaymentMethodLookupParams,
  { signal }: QueryRequestContext,
): Promise<readonly PaymentMethodLookupDto[]> => {
  const body = await customFetch<unknown>(paymentMethodLookupEndpoint(params), {
    signal,
  });
  return paymentMethodLookupResponseSchema.parse(body).data;
};

export const paymentMethodListQueryOptions = (
  params: PaymentMethodListParams = {},
) =>
  queryOptions({
    queryKey: paymentMethodKeys.list(params),
    queryFn: ({ signal }) => loadPaymentMethods(params, { signal }),
    meta: { feature: 'payment-method', operation: 'list' },
  });

export const paymentMethodDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: paymentMethodKeys.detail(id),
    queryFn: ({ signal }) => loadPaymentMethod(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'payment-method', operation: 'detail' },
  });

export const paymentMethodLookupQueryOptions = (
  params: PaymentMethodLookupParams = {},
) => {
  const resolved: PaymentMethodLookupParams = {
    activeOnly: params.activeOnly ?? true,
    isMobileVisible: params.isMobileVisible,
    isCustomerPortalVisible: params.isCustomerPortalVisible,
  };
  return queryOptions({
    queryKey: paymentMethodKeys.lookup(resolved),
    queryFn: ({ signal }) => loadPaymentMethodLookup(resolved, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'payment-method', operation: 'lookup' },
  });
};
