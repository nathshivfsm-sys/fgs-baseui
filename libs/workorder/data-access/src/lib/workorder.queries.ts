import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { workorderListSchema, type Workorder } from './workorder.schema';

export type LoadWorkorders = (
  tenantId: string,
  context: QueryRequestContext,
) => Promise<readonly Workorder[]>;

/**
 * No real backend exists yet (see libs/shared/api/README.md) — this returns static
 * mock data rather than calling customFetch. The Zod parse below still runs so a
 * response shape mismatch is caught the same way it would be once this calls a real
 * endpoint, rather than only becoming a problem the day a backend is introduced.
 */
export const loadWorkorders: LoadWorkorders = async (tenantId) =>
  workorderListSchema.parse([
    { id: 'WO-1042', title: `Inspect HVAC · ${tenantId}`, status: 'Open' },
    {
      id: 'WO-1043',
      title: 'Replace loading-bay sensor',
      status: 'Scheduled',
    },
  ]);

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
