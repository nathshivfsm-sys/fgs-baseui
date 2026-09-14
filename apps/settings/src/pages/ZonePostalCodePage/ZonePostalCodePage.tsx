import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import type {
  PostalCodeCreateDto,
  PostalCodeSummaryDto,
  ZoneCreateDto,
  ZoneSummaryDto,
} from '@cms/settings-contract';
import {
  createPostalCodeMutationOptions,
  createZoneMutationOptions,
  postalCodeLookupQueryOptions,
  taxLookupQueryOptions,
  updatePostalCodeMutationOptions,
  updateZoneMutationOptions,
  zoneLookupQueryOptions,
} from '@cms/settings-data-access';
import { Callout, type SelectOption } from '@cms/ui';
import {
  CatalogNavPanel,
  PostalCodeFormDialog,
  PostalCodeTablePanel,
  ZoneFormDialog,
  ZonePostalCodeHeader,
  ZoneTablePanel,
} from './component';
import type { ZoneCatalog } from './types';
import {
  catalogFromSearch,
  describePostalCodeError,
  describeZoneError,
} from './util';

export interface ZonePostalCodePageProps {
  queryClient: QueryClient;
}

export function ZonePostalCodePage({ queryClient }: ZonePostalCodePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [postalDialogOpen, setPostalDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneSummaryDto | null>(null);
  const [editingPostalCode, setEditingPostalCode] =
    useState<PostalCodeSummaryDto | null>(null);

  const activeZoneLookup = useQuery(zoneLookupQueryOptions(true), queryClient);
  const allZoneLookup = useQuery(zoneLookupQueryOptions(false), queryClient);
  const activePostalLookup = useQuery(
    postalCodeLookupQueryOptions(true),
    queryClient,
  );
  const allPostalLookup = useQuery(
    postalCodeLookupQueryOptions(false),
    queryClient,
  );
  const taxLookup = useQuery(taxLookupQueryOptions(true), queryClient);
  const createZoneMutation = useMutation(
    createZoneMutationOptions(queryClient),
    queryClient,
  );
  const updateZoneMutation = useMutation(
    updateZoneMutationOptions(queryClient),
    queryClient,
  );
  const createPostalMutation = useMutation(
    createPostalCodeMutationOptions(queryClient),
    queryClient,
  );
  const updatePostalMutation = useMutation(
    updatePostalCodeMutationOptions(queryClient),
    queryClient,
  );

  const activeZoneCount = activeZoneLookup.data?.length ?? 0;
  const inactiveZoneCount = Math.max(
    0,
    (allZoneLookup.data?.length ?? 0) - activeZoneCount,
  );
  const activePostalCount = activePostalLookup.data?.length ?? 0;
  const inactivePostalCount = Math.max(
    0,
    (allPostalLookup.data?.length ?? 0) - activePostalCount,
  );
  const saveMessage = updatePostalMutation.isSuccess
    ? 'Postal code updated'
    : createPostalMutation.isSuccess
      ? 'Postal code created'
      : updateZoneMutation.isSuccess
        ? 'Zone updated'
        : createZoneMutation.isSuccess
          ? 'Zone created'
          : null;
  const writeError =
    createPostalMutation.error ??
    updatePostalMutation.error ??
    createZoneMutation.error ??
    updateZoneMutation.error;
  const writeErrorCopy = writeError
    ? createPostalMutation.error || updatePostalMutation.error
      ? describePostalCodeError(writeError)
      : describeZoneError(writeError)
    : null;

  const zoneOptions = useMemo<SelectOption[]>(
    () =>
      (activeZoneLookup.data ?? []).map((zone) => ({
        value: String(zone.id),
        label: zone.name ?? zone.code ?? String(zone.id),
      })),
    [activeZoneLookup.data],
  );
  const taxOptions = useMemo<SelectOption[]>(
    () =>
      (taxLookup.data ?? []).map((tax) => ({
        value: String(tax.id),
        label: tax.taxCode ?? tax.name ?? String(tax.id),
      })),
    [taxLookup.data],
  );

  function openCreate() {
    if (catalog === 'postal') {
      setEditingPostalCode(null);
      setPostalDialogOpen(true);
      return;
    }
    setEditingZone(null);
    setZoneDialogOpen(true);
  }

  function openEditZone(zone: ZoneSummaryDto) {
    setEditingZone(zone);
    setZoneDialogOpen(true);
  }

  function openEditPostal(postalCode: PostalCodeSummaryDto) {
    setEditingPostalCode(postalCode);
    setPostalDialogOpen(true);
  }

  function closeZoneDialog() {
    setZoneDialogOpen(false);
  }

  function closePostalDialog() {
    setPostalDialogOpen(false);
  }

  function handleCatalogChange(next: ZoneCatalog) {
    setSearchParams(next === 'postal' ? { catalog: 'postal' } : {}, {
      replace: true,
    });
  }

  function handleZoneDialogOpenChange(open: boolean) {
    setZoneDialogOpen(open);
    if (!open) setEditingZone(null);
  }

  function handlePostalDialogOpenChange(open: boolean) {
    setPostalDialogOpen(open);
    if (!open) setEditingPostalCode(null);
  }

  function handleZoneSubmit(body: ZoneCreateDto) {
    if (editingZone) {
      updateZoneMutation.mutate(
        { id: editingZone.id, body },
        { onSuccess: closeZoneDialog },
      );
      return;
    }
    createZoneMutation.mutate(body, { onSuccess: closeZoneDialog });
  }

  function handlePostalSubmit(body: PostalCodeCreateDto) {
    if (editingPostalCode) {
      updatePostalMutation.mutate(
        { id: editingPostalCode.id, body },
        { onSuccess: closePostalDialog },
      );
      return;
    }
    createPostalMutation.mutate(body, { onSuccess: closePostalDialog });
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="zone-postal-code"
    >
      <ZonePostalCodeHeader catalog={catalog} onAdd={openCreate} />

      {saveMessage ? (
        <Callout title="Saved" variant="success">
          {saveMessage}
        </Callout>
      ) : null}
      {writeErrorCopy ? (
        <Callout title="Could not save" variant="error">
          {writeErrorCopy}
        </Callout>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:flex-row">
        <CatalogNavPanel
          activePostalCount={
            activePostalLookup.isSuccess ? activePostalCount : undefined
          }
          activeZoneCount={
            activeZoneLookup.isSuccess ? activeZoneCount : undefined
          }
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
        />
        {catalog === 'postal' ? (
          <PostalCodeTablePanel
            activeCount={activePostalCount}
            inactiveCount={inactivePostalCount}
            onEdit={openEditPostal}
            queryClient={queryClient}
          />
        ) : (
          <ZoneTablePanel
            activeCount={activeZoneCount}
            inactiveCount={inactiveZoneCount}
            onEdit={openEditZone}
            queryClient={queryClient}
          />
        )}
      </div>

      <ZoneFormDialog
        isPending={
          createZoneMutation.isPending || updateZoneMutation.isPending
        }
        onOpenChange={handleZoneDialogOpenChange}
        onSubmit={handleZoneSubmit}
        open={zoneDialogOpen}
        zone={editingZone}
      />
      <PostalCodeFormDialog
        isPending={
          createPostalMutation.isPending || updatePostalMutation.isPending
        }
        onOpenChange={handlePostalDialogOpenChange}
        onSubmit={handlePostalSubmit}
        open={postalDialogOpen}
        postalCode={editingPostalCode}
        taxOptions={taxOptions}
        zoneOptions={zoneOptions}
      />
    </section>
  );
}
