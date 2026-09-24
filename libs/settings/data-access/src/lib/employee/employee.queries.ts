import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  employeeDetailResponseSchema,
  employeeListResponseSchema,
  employeeLookupResponseSchema,
  type EmployeeDetailDto,
  type EmployeeListParams,
  type EmployeeListResult,
  type EmployeeLookupDto,
} from '@cms/settings-contract';
import { toPagedResult } from '../util';
import {
  employeeDetailEndpoint,
  employeeListEndpoint,
  employeeLookupEndpoint,
} from './employee.endpoints';
import { employeeKeys } from './employee.keys';

export const loadEmployees = async (
  params: EmployeeListParams,
  { signal }: QueryRequestContext,
): Promise<EmployeeListResult> => {
  const body = await customFetch<unknown>(employeeListEndpoint(params), {
    signal,
  });
  const data = employeeListResponseSchema.parse(body).data;
  return {
    ...toPagedResult(data),
    summary: data.summary ?? null,
  };
};

export const loadEmployee = async (
  id: number,
  { signal }: QueryRequestContext,
): Promise<EmployeeDetailDto> => {
  const body = await customFetch<unknown>(employeeDetailEndpoint(id), {
    signal,
  });
  return employeeDetailResponseSchema.parse(body).data;
};

export const loadEmployeeLookup = async (
  activeOnly: boolean,
  { signal }: QueryRequestContext,
): Promise<readonly EmployeeLookupDto[]> => {
  const body = await customFetch<unknown>(employeeLookupEndpoint(activeOnly), {
    signal,
  });
  return employeeLookupResponseSchema.parse(body).data;
};

export const employeeListQueryOptions = (params: EmployeeListParams = {}) =>
  queryOptions({
    queryKey: employeeKeys.list(params),
    queryFn: ({ signal }) => loadEmployees(params, { signal }),
    meta: { feature: 'employee', operation: 'list' },
  });

export const employeeDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: employeeKeys.detail(id),
    queryFn: ({ signal }) => loadEmployee(id, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'employee', operation: 'detail' },
  });

export const employeeLookupQueryOptions = (activeOnly = true) =>
  queryOptions({
    queryKey: employeeKeys.lookup(activeOnly),
    queryFn: ({ signal }) => loadEmployeeLookup(activeOnly, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'employee', operation: 'lookup' },
  });
