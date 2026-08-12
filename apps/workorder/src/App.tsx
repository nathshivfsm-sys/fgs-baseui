import { useQuery } from '@tanstack/react-query';
import { Wrench } from 'lucide-react';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { Button } from '@cms/ui';
import './styles.css';

export interface AppProps {
  runtime: CmsRuntime;
}

export function App({ runtime }: AppProps) {
  const tenantId = useStore(runtime.appStore, (state) => state.tenantId);
  const query = useQuery(
    {
      queryKey: ['workorder', 'list', tenantId],
      queryFn: async () => [
        { id: 'WO-1042', title: `Inspect HVAC · ${tenantId}`, status: 'Open' },
        {
          id: 'WO-1043',
          title: 'Replace loading-bay sensor',
          status: 'Scheduled',
        },
      ],
    },
    runtime.queryClient,
  );

  return (
    <section className="space-y-4" data-testid="workorder">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Maintenance</p>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Wrench className="size-6 text-primary" /> Work orders
          </h2>
        </div>
        <Button
          onClick={() =>
            runtime.queryClient.invalidateQueries({ queryKey: ['workorder'] })
          }
        >
          Refresh
        </Button>
      </div>
      <div className="grid gap-3">
        {query.isPending ? (
          <p>Loading…</p>
        ) : (
          query.data?.map((item) => (
            <article className="rounded-lg border bg-card p-4" key={item.id}>
              <div className="flex justify-between">
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
