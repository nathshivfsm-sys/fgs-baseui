import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { leadListSchema, type Lead } from './lead.schema';

export type LoadLeads = (
  tenantId: string,
  context: QueryRequestContext,
) => Promise<readonly Lead[]>;

/**
 * No real backend exists yet (see libs/shared/api/README.md) — this returns static
 * mock data rather than calling customFetch. The Zod parse below still runs so a
 * response shape mismatch is caught the same way it would be once this calls a real
 * endpoint, rather than only becoming a problem the day a backend is introduced.
 */
export const loadLeads: LoadLeads = async (tenantId) =>
  leadListSchema.parse([
    { id: 'LD-208', name: `Avery Stone · ${tenantId}`, stage: 'Qualified' },
    { id: 'LD-209', name: 'Morgan Lee', stage: 'New' },
  ]);

export const leadKeys = {
  all: ['leads'] as const,
  lists: () => [...leadKeys.all, 'list'] as const,
  list: (tenantId: string) => [...leadKeys.lists(), { tenantId }] as const,
};

export const leadListQueryOptions = (
  tenantId: string,
  load: LoadLeads = loadLeads,
) =>
  queryOptions({
    queryKey: leadKeys.list(tenantId),
    queryFn: ({ signal }) => load(tenantId, { signal }),
    meta: { feature: 'leads', operation: 'list' },
  });
