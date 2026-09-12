import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import type { ZoneCreateDto, ZoneSummaryDto } from '@cms/settings-contract';
import {
  createZoneMutationOptions,
  updateZoneMutationOptions,
  zoneLookupQueryOptions,
} from '@cms/settings-data-access';
import { Callout } from '@cms/ui';
import {
  CatalogNavPanel,
  PostalCodePanel,
  ZoneFormDialog,
  ZonePostalCodeHeader,
  ZoneTablePanel,
} from './component';
import type { ZoneCatalog } from './types';
import { catalogFromSearch, describeZoneError } from './util';

export interface ZonePostalCodePageProps {
  queryClient: QueryClient;
}

export function ZonePostalCodePage({ queryClient }: ZonePostalCodePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneSummaryDto | null>(null);

  const activeLookup = useQuery(zoneLookupQueryOptions(true), queryClient);
  const allLookup = useQuery(zoneLookupQueryOptions(false), queryClient);
  const createMutation = useMutation(
    createZoneMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateZoneMutationOptions(queryClient),
    queryClient,
  );

  const activeCount = activeLookup.data?.length ?? 0;
  const inactiveCount = Math.max(
    0,
    (allLookup.data?.length ?? 0) - activeCount,
  );
  const saveMessage = updateMutation.isSuccess
    ? 'Zone updated'
    : createMutation.isSuccess
      ? 'Zone created'
      : null;
  const writeError = createMutation.error ?? updateMutation.error;
  const writePending = createMutation.isPending || updateMutation.isPending;

  function openCreate() {
    setEditingZone(null);
    setDialogOpen(true);
  }

  function openEdit(zone: ZoneSummaryDto) {
    setEditingZone(zone);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  function handleCatalogChange(next: ZoneCatalog) {
    setSearchParams(next === 'postal' ? { catalog: 'postal' } : {}, {
      replace: true,
    });
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) setEditingZone(null);
  }

  function handleZoneSubmit(body: ZoneCreateDto) {
    if (editingZone) {
      updateMutation.mutate(
        { id: editingZone.id, body },
        { onSuccess: closeDialog },
      );
      return;
    }
    createMutation.mutate(body, { onSuccess: closeDialog });
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="zone-postal-code"
    >
      <ZonePostalCodeHeader catalog={catalog} onAddZone={openCreate} />

      {saveMessage ? (
        <Callout title="Saved" variant="success">
          {saveMessage}
        </Callout>
      ) : null}
      {writeError ? (
        <Callout title="Could not save" variant="error">
          {describeZoneError(writeError)}
        </Callout>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:flex-row">
        <CatalogNavPanel
          activeZoneCount={activeLookup.isSuccess ? activeCount : undefined}
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
        />
        {catalog === 'postal' ? (
          <PostalCodePanel />
        ) : (
          <ZoneTablePanel
            activeCount={activeCount}
            inactiveCount={inactiveCount}
            onEdit={openEdit}
            queryClient={queryClient}
          />
        )}
      </div>

      <ZoneFormDialog
        isPending={writePending}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleZoneSubmit}
        open={dialogOpen}
        zone={editingZone}
      />
    </section>
  );
}
