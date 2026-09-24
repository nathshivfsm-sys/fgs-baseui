import type { EmployeeListParams } from '@cms/settings-contract';

export const employeeKeys = {
  all: ['employee'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: EmployeeListParams = {}) =>
    [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  lookups: () => [...employeeKeys.all, 'lookup'] as const,
  lookup: (activeOnly: boolean) =>
    [...employeeKeys.lookups(), { activeOnly }] as const,
} as const;
