import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import type { CmsRuntime } from '@cms/platform-contract';
import {
  BodySmall,
  BriefcaseIcon,
  Button,
  Heading2,
  SectionCard,
} from '@cms/ui';
import {
  loadWorkorders,
  workorderKeys,
  workorderListQueryOptions,
  type LoadWorkorders,
  type Workorder,
} from '@cms/workorder-data-access';
import { RemoteErrorBoundary } from './error-boundary';
import { createWorkorderUiStore } from './store/store';
import './styles.css';

export type { LoadWorkorders, Workorder } from '@cms/workorder-data-access';

export interface AppProps {
  runtime: CmsRuntime;
  loadWorkorders?: LoadWorkorders;
}

export function App({
  runtime,
  loadWorkorders: load = loadWorkorders,
}: AppProps) {
  const [localStore] = useState(() => createWorkorderUiStore());
  const viewDensity = useStore(localStore, (state) => state.viewDensity);
  const toggleViewDensity = useStore(
    localStore,
    (state) => state.toggleViewDensity,
  );
  const query = useQuery(
    workorderListQueryOptions(runtime.tenantId, load),
    runtime.queryClient,
  );
  const cardPadding = viewDensity === 'compact' ? 'p-2' : 'p-4';

  return (
    <RemoteErrorBoundary>
      <section className="space-y-4" data-testid="workorder">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BodySmall color="foreground-muted">Maintenance</BodySmall>
            <Heading2 bold className="flex items-center gap-2 text-2xl">
              <BriefcaseIcon className="size-6 text-primary" /> Work orders
            </Heading2>
            <BodySmall className="text-caption" color="foreground-muted">
              Global tenant: {runtime.tenantId} · User:{' '}
              {runtime.currentUser.displayName} ({runtime.currentUser.role}) ·
              Work-order-local view: {viewDensity}
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
                  queryKey: workorderKeys.list(runtime.tenantId),
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
            <BodySmall role="status">Loading work orders…</BodySmall>
          ) : query.isError ? (
            <BodySmall color="destructive" role="alert">
              Unable to load work orders: {query.error.message}
            </BodySmall>
          ) : query.data.length === 0 ? (
            <BodySmall color="foreground-muted">
              No work orders found.
            </BodySmall>
          ) : (
            query.data.map((item: Workorder) => (
              <SectionCard className={cardPadding} key={item.id}>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <strong>{item.id}</strong>
                  <span className="text-sm text-primary">{item.status}</span>
                </div>
                <BodySmall className="mt-2" color="foreground-muted">
                  {item.title}
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
