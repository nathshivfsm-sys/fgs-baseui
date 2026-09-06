import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import { BodySmall, Button, Heading2, SectionCard, UsersIcon } from '@cms/ui';
import {
  leadKeys,
  leadListQueryOptions,
  loadLeads,
  type Lead,
  type LoadLeads,
} from '@cms/lead-data-access';
import { RemoteErrorBoundary } from './error-boundary';
import { createLeadUiStore } from './store/store';
import './styles.css';

export type { Lead, LoadLeads } from '@cms/lead-data-access';

export interface AppProps {
  runtime: CmsRuntime;
  loadLeads?: LoadLeads;
}

export function App({ runtime, loadLeads: load = loadLeads }: AppProps) {
  const [localStore] = useState(() => createLeadUiStore());
  const viewDensity = useStore(localStore, (state) => state.viewDensity);
  const toggleViewDensity = useStore(
    localStore,
    (state) => state.toggleViewDensity,
  );
  const query = useQuery(
    leadListQueryOptions(runtime.tenantId, load),
    runtime.queryClient,
  );
  const cardPadding = viewDensity === 'compact' ? 'p-2' : 'p-4';

  return (
    <RemoteErrorBoundary>
      <section className="space-y-4" data-testid="lead">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BodySmall color="foreground-muted">Sales</BodySmall>
            <Heading2 bold className="flex items-center gap-2 text-2xl">
              <UsersIcon className="size-6 text-primary" /> Leads
            </Heading2>
            <BodySmall className="text-caption" color="foreground-muted">
              Global tenant: {runtime.tenantId} · User:{' '}
              {runtime.currentUser.displayName} ({runtime.currentUser.role}) ·
              Lead-local view: {viewDensity}
            </BodySmall>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              aria-pressed={viewDensity === 'compact'}
              className="w-full sm:w-auto"
              onClick={toggleViewDensity}
              variant="outline"
            >
              Toggle local view
            </Button>
            <Button
              aria-busy={query.isFetching}
              className="w-full sm:w-auto"
              disabled={query.isFetching}
              onClick={() =>
                runtime.queryClient.invalidateQueries({
                  queryKey: leadKeys.list(runtime.tenantId),
                  exact: true,
                })
              }
            >
              {query.isFetching && !query.isPending ? 'Refreshing…' : 'Refresh'}
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          {query.isPending ? (
            <BodySmall role="status">Loading leads…</BodySmall>
          ) : query.isError ? (
            <BodySmall color="destructive" role="alert">
              Unable to load leads: {query.error.message}
            </BodySmall>
          ) : query.data.length === 0 ? (
            <BodySmall color="foreground-muted">No leads found.</BodySmall>
          ) : (
            query.data.map((item: Lead) => (
              <SectionCard className={cardPadding} key={item.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <strong>{item.name}</strong>
                  <span className="text-sm text-primary">{item.stage}</span>
                </div>
                <BodySmall className="mt-2" color="foreground-muted">
                  {item.id}
                </BodySmall>
              </SectionCard>
            ))
          )}
        </div>
      </section>
    </RemoteErrorBoundary>
  );
}

export default App;
