import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';

export interface Workorder {
  id: string;
  title: string;
  status: string;
}

export type LoadWorkorders = (
  tenantId: string,
  context: QueryRequestContext,
) => Promise<readonly Workorder[]>;

export const loadWorkorders: LoadWorkorders = async (tenantId) => [
  { id: 'WO-1042', title: `Inspect HVAC · ${tenantId}`, status: 'Open' },
  {
    id: 'WO-1043',
    title: 'Replace loading-bay sensor',
    status: 'Scheduled',
  },
];

export const workorderKeys = {
  all: ['workorders'] as const,
  lists: () => [...workorderKeys.all, 'list'] as const,
  list: (tenantId: string) => [...workorderKeys.lists(), { tenantId }] as const,
};

export const workorderListQueryOptions = (
  tenantId: string,
  load: LoadWorkorders = loadWorkorders,
) =>
  queryOptions({
    queryKey: workorderKeys.list(tenantId),
    queryFn: ({ signal }) => load(tenantId, { signal }),
    meta: { feature: 'workorders', operation: 'list' },
  });
