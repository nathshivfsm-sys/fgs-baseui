import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  paymentTermDetailResponseSchema,
  type PaymentTermCreateDto,
  type PaymentTermDetailDto,
  type PaymentTermPatchDto,
  type PaymentTermUpdateDto,
} from '@cms/shared-contract';
import {
  paymentTermCollectionEndpoint,
  paymentTermDetailEndpoint,
} from './payment-term.endpoints';
import { paymentTermKeys } from './payment-term.keys';

async function parsePaymentTermDetail(
  body: unknown,
): Promise<PaymentTermDetailDto> {
  return paymentTermDetailResponseSchema.parse(body).data;
}

export const createPaymentTerm = async (
  body: PaymentTermCreateDto,
  context?: QueryRequestContext,
): Promise<PaymentTermDetailDto> => {
  const response = await customFetch<unknown>(paymentTermCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePaymentTermDetail(response);
};

export const updatePaymentTerm = async (
  id: number,
  body: PaymentTermUpdateDto,
  context?: QueryRequestContext,
): Promise<PaymentTermDetailDto> => {
  const response = await customFetch<unknown>(paymentTermDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePaymentTermDetail(response);
};

export const patchPaymentTerm = async (
  id: number,
  body: PaymentTermPatchDto,
  context?: QueryRequestContext,
): Promise<PaymentTermDetailDto> => {
  const response = await customFetch<unknown>(paymentTermDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parsePaymentTermDetail(response);
};

function invalidatePaymentTerms(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: paymentTermKeys.all });
}

export const createPaymentTermMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: PaymentTermCreateDto) => createPaymentTerm(body),
    meta: { feature: 'payment-term', operation: 'create' },
    onSuccess: () => invalidatePaymentTerms(queryClient),
  });

export const updatePaymentTermMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PaymentTermUpdateDto }) =>
      updatePaymentTerm(id, body),
    meta: { feature: 'payment-term', operation: 'update' },
    onSuccess: () => invalidatePaymentTerms(queryClient),
  });

export const patchPaymentTermMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: PaymentTermPatchDto }) =>
      patchPaymentTerm(id, body),
    meta: { feature: 'payment-term', operation: 'patch' },
    onSuccess: () => invalidatePaymentTerms(queryClient),
  });
