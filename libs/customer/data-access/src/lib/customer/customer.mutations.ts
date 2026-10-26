import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  customerCreateResponseSchema,
  customerDetailResponseSchema,
  type CustomerCreateDto,
  type CustomerCreateResultDto,
  type CustomerDetailDto,
  type CustomerPatchDto,
  type CustomerUpdateDto,
} from '@cms/customer-contract';
import {
  customerCollectionEndpoint,
  customerDetailEndpoint,
} from './customer.endpoints';
import { customerKeys } from './customer.keys';

async function parseCustomerDetail(body: unknown): Promise<CustomerDetailDto> {
  return customerDetailResponseSchema.parse(body).data;
}

export const createCustomer = async (
  body: CustomerCreateDto,
  context?: QueryRequestContext,
): Promise<CustomerCreateResultDto> => {
  const response = await customFetch<unknown>(customerCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return customerCreateResponseSchema.parse(response).data;
};

export const updateCustomer = async (
  id: number,
  body: CustomerUpdateDto,
  context?: QueryRequestContext,
): Promise<CustomerDetailDto> => {
  const response = await customFetch<unknown>(customerDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseCustomerDetail(response);
};

export const patchCustomer = async (
  id: number,
  body: CustomerPatchDto,
  context?: QueryRequestContext,
): Promise<CustomerDetailDto> => {
  const response = await customFetch<unknown>(customerDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseCustomerDetail(response);
};

function invalidateCustomers(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: customerKeys.all });
}

export const createCustomerMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: CustomerCreateDto) => createCustomer(body),
    meta: { feature: 'customer', operation: 'create' },
    onSuccess: () => invalidateCustomers(queryClient),
  });

export const updateCustomerMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: CustomerUpdateDto }) =>
      updateCustomer(id, body),
    meta: { feature: 'customer', operation: 'update' },
    onSuccess: () => invalidateCustomers(queryClient),
  });

export const patchCustomerMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: CustomerPatchDto }) =>
      patchCustomer(id, body),
    meta: { feature: 'customer', operation: 'patch' },
    onSuccess: () => invalidateCustomers(queryClient),
  });
