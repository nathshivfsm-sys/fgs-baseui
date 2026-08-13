import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { Button } from '@cms/ui';
import {
  leadKeys,
  leadListQueryOptions,
  loadLeads,
  type Lead,
  type LoadLeads,
} from './lead.queries';
import './styles.css';

export type { Lead, LoadLeads } from './lead.queries';

export interface AppProps {
  runtime: CmsRuntime;
  loadLeads?: LoadLeads;
}

export function App({ runtime, loadLeads: load = loadLeads }: AppProps) {
  const tenantId = useStore(runtime.appStore, (state) => state.tenantId);
  const query = useQuery(
    leadListQueryOptions(tenantId, load),
    runtime.queryClient,
  );

  return (
    <section className="space-y-4" data-testid="lead">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Sales</p>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Users className="size-6 text-primary" /> Leads
          </h2>
        </div>
        <Button
          aria-busy={query.isFetching}
          className="w-full sm:w-auto"
          disabled={query.isFetching}
          onClick={() =>
            runtime.queryClient.invalidateQueries({
              queryKey: leadKeys.list(tenantId),
              exact: true,
            })
          }
        >
          {query.isFetching && !query.isPending ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>
      <div className="grid gap-3">
        {query.isPending ? (
          <p role="status">Loading leads…</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive" role="alert">
            Unable to load leads: {query.error.message}
          </p>
        ) : query.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leads found.</p>
        ) : (
          query.data.map((item: Lead) => (
            <article className="rounded-lg border bg-card p-4" key={item.id}>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <strong>{item.name}</strong>
                <span className="text-sm text-primary">{item.stage}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.id}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default App;
