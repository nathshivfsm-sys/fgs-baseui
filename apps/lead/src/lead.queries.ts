import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';

export interface Lead {
  id: string;
  name: string;
  stage: string;
}

export type LoadLeads = (
  tenantId: string,
  context: QueryRequestContext,
) => Promise<readonly Lead[]>;

export const loadLeads: LoadLeads = async (tenantId) => [
  { id: 'LD-208', name: `Avery Stone · ${tenantId}`, stage: 'Qualified' },
  { id: 'LD-209', name: 'Morgan Lee', stage: 'New' },
];

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
