import { useQuery } from '@tanstack/react-query';
import { Wrench } from 'lucide-react';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { Button } from '@cms/ui';
import {
  loadWorkorders,
  workorderKeys,
  workorderListQueryOptions,
  type LoadWorkorders,
  type Workorder,
} from './workorder.queries';
import './styles.css';

export type { LoadWorkorders, Workorder } from './workorder.queries';

export interface AppProps {
  runtime: CmsRuntime;
  loadWorkorders?: LoadWorkorders;
}

export function App({
  runtime,
  loadWorkorders: load = loadWorkorders,
}: AppProps) {
  const tenantId = useStore(runtime.appStore, (state) => state.tenantId);
  const query = useQuery(
    workorderListQueryOptions(tenantId, load),
    runtime.queryClient,
  );

  return (
    <section className="space-y-4" data-testid="workorder">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Maintenance</p>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Wrench className="size-6 text-primary" /> Work orders
          </h2>
        </div>
        <Button
          aria-busy={query.isFetching}
          className="w-full sm:w-auto"
          disabled={query.isFetching}
          onClick={() =>
            runtime.queryClient.invalidateQueries({
              queryKey: workorderKeys.list(tenantId),
              exact: true,
            })
          }
        >
          {query.isFetching && !query.isPending ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>
      <div className="grid gap-3">
        {query.isPending ? (
          <p role="status">Loading work orders…</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive" role="alert">
            Unable to load work orders: {query.error.message}
          </p>
        ) : query.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No work orders found.</p>
        ) : (
          query.data.map((item: Workorder) => (
            <article className="rounded-lg border bg-card p-4" key={item.id}>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                <strong>{item.id}</strong>
                <span className="text-sm text-primary">{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.title}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default App;
