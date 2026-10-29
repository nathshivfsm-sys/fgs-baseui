import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  paymentMethodDetailResponseSchema,
  type PaymentMethodCreateDto,
  type PaymentMethodDetailDto,
  type PaymentMethodPatchDto,
  type PaymentMethodUpdateDto,
} from '@cms/settings-contract';
import {
  paymentMethodCollectionEndpoint,
  paymentMethodDetailEndpoint,
} from './payment-method.endpoints';
import { paymentMethodKeys } from './payment-method.keys';

async function parsePaymentMethodDetail(
  body: unknown,
): Promise<PaymentMethodDetailDto> {
  return paymentMethodDetailResponseSchema.parse(body).data;
}

export const createPaymentMethod = async (
  body: PaymentMethodCreateDto,
  context?: QueryRequestContext,
): Promise<PaymentMethodDetailDto> => {
  const response = await customFetch<unknown>(paymentMethodCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePaymentMethodDetail(response);
};

export const updatePaymentMethod = async (
  id: number,
  body: PaymentMethodUpdateDto,
  context?: QueryRequestContext,
): Promise<PaymentMethodDetailDto> => {
  const response = await customFetch<unknown>(paymentMethodDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePaymentMethodDetail(response);
};

export const patchPaymentMethod = async (
  id: number,
  body: PaymentMethodPatchDto,
  context?: QueryRequestContext,
): Promise<PaymentMethodDetailDto> => {
  const response = await customFetch<unknown>(paymentMethodDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePaymentMethodDetail(response);
};

function invalidatePaymentMethods(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
}

export const createPaymentMethodMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PaymentMethodCreateDto) => createPaymentMethod(body),
    meta: { feature: 'payment-method', operation: 'create' },
    onSuccess: () => invalidatePaymentMethods(queryClient),
  });

export const updatePaymentMethodMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PaymentMethodUpdateDto }) =>
      updatePaymentMethod(id, body),
    meta: { feature: 'payment-method', operation: 'update' },
    onSuccess: () => invalidatePaymentMethods(queryClient),
  });

export const patchPaymentMethodMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PaymentMethodPatchDto }) =>
      patchPaymentMethod(id, body),
    meta: { feature: 'payment-method', operation: 'patch' },
    onSuccess: () => invalidatePaymentMethods(queryClient),
  });
