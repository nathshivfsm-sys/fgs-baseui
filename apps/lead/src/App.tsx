import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
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
      queryKey: ['lead', 'list', tenantId],
      queryFn: async () => [
        { id: 'LD-208', name: `Avery Stone · ${tenantId}`, stage: 'Qualified' },
        { id: 'LD-209', name: 'Morgan Lee', stage: 'New' },
      ],
    },
    runtime.queryClient,
  );

  return (
    <section className="space-y-4" data-testid="lead">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Sales</p>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Users className="size-6 text-primary" /> Leads
          </h2>
        </div>
        <Button
          onClick={() =>
            runtime.queryClient.invalidateQueries({ queryKey: ['lead'] })
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
