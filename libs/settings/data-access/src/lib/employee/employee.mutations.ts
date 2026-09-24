import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  employeeDetailResponseSchema,
  type EmployeeCreateDto,
  type EmployeeDetailDto,
  type EmployeePatchDto,
  type EmployeeUpdateDto,
} from '@cms/settings-contract';
import {
  employeeCollectionEndpoint,
  employeeDetailEndpoint,
} from './employee.endpoints';
import { employeeKeys } from './employee.keys';

async function parseEmployeeDetail(body: unknown): Promise<EmployeeDetailDto> {
  return employeeDetailResponseSchema.parse(body).data;
}

export const createEmployee = async (
  body: EmployeeCreateDto,
  context?: QueryRequestContext,
): Promise<EmployeeDetailDto> => {
  const response = await customFetch<unknown>(employeeCollectionEndpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseEmployeeDetail(response);
};

export const updateEmployee = async (
  id: number,
  body: EmployeeUpdateDto,
  context?: QueryRequestContext,
): Promise<EmployeeDetailDto> => {
  const response = await customFetch<unknown>(employeeDetailEndpoint(id), {
    method: 'PUT',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseEmployeeDetail(response);
};

export const patchEmployee = async (
  id: number,
  body: EmployeePatchDto,
  context?: QueryRequestContext,
): Promise<EmployeeDetailDto> => {
  const response = await customFetch<unknown>(employeeDetailEndpoint(id), {
    method: 'PATCH',
    body: JSON.stringify(body),
    signal: context?.signal,
  });
  return parseEmployeeDetail(response);
};

function invalidateEmployees(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: employeeKeys.all });
}

export const createEmployeeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: EmployeeCreateDto) => createEmployee(body),
    meta: { feature: 'employee', operation: 'create' },
    onSuccess: () => invalidateEmployees(queryClient),
  });

export const updateEmployeeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: EmployeeUpdateDto }) =>
      updateEmployee(id, body),
    meta: { feature: 'employee', operation: 'update' },
    onSuccess: () => invalidateEmployees(queryClient),
  });

export const patchEmployeeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, body }: { id: number; body: EmployeePatchDto }) =>
      patchEmployee(id, body),
    meta: { feature: 'employee', operation: 'patch' },
    onSuccess: () => invalidateEmployees(queryClient),
  });
