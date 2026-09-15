import { lazy, Suspense, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { GlBreakCreateDto, GlBreakSummaryDto } from '@cms/settings-contract';
import {
  createGlBreakMutationOptions,
  glBreakLookupQueryOptions,
  updateGlBreakMutationOptions,
} from '@cms/settings-data-access';
import { Callout } from '@cms/ui';
import {
  ADD_BREAK_TWO_LABEL,
  ADD_BUSINESS_UNIT_LABEL,
  BREAK_TWO_BREAK_LEVEL,
  BUSINESS_UNIT_BREAK_LEVEL,
} from './constant';
import {
  BusinessUnitHeader,
  CatalogNavPanel,
  GlBreakTablePanel,
} from './component';
import type { BusinessUnitCatalog, BusinessUnitPageProps } from './types';
import {
  breakLevelForCatalog,
  catalogFromSearch,
  describeGlBreakError,
} from './util';

const GlBreakFormDialog = lazy(() =>
  import('./component/GlBreakFormDialog').then((module) => ({
    default: module.GlBreakFormDialog,
  })),
);

const countForLevel = (
  items: readonly { breakLevel: number }[] | undefined,
  level: number,
) => (items ?? []).filter((item) => item.breakLevel === level).length;

export const BusinessUnitPage = ({ queryClient }: BusinessUnitPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const breakLevel = breakLevelForCatalog(catalog);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GlBreakSummaryDto | null>(
    null,
  );

  const activeLookup = useQuery(glBreakLookupQueryOptions(true), queryClient);
  const allLookup = useQuery(glBreakLookupQueryOptions(false), queryClient);
  const createMutation = useMutation(
    createGlBreakMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateGlBreakMutationOptions(queryClient),
    queryClient,
  );

  const activeBusinessUnitCount = countForLevel(
    activeLookup.data,
    BUSINESS_UNIT_BREAK_LEVEL,
  );
  const inactiveBusinessUnitCount = Math.max(
    0,
    countForLevel(allLookup.data, BUSINESS_UNIT_BREAK_LEVEL) -
      activeBusinessUnitCount,
  );
  const activeBreakTwoCount = countForLevel(
    activeLookup.data,
    BREAK_TWO_BREAK_LEVEL,
  );
  const inactiveBreakTwoCount = Math.max(
    0,
    countForLevel(allLookup.data, BREAK_TWO_BREAK_LEVEL) - activeBreakTwoCount,
  );

  const saveMessage = updateMutation.isSuccess
    ? catalog === 'break-2'
      ? 'Break 2 updated'
      : 'Business unit updated'
    : createMutation.isSuccess
      ? catalog === 'break-2'
        ? 'Break 2 created'
        : 'Business unit created'
      : null;
  const writeError = createMutation.error ?? updateMutation.error;
  const writeErrorCopy = writeError ? describeGlBreakError(writeError) : null;

  const handleCatalogChange = (next: BusinessUnitCatalog) => {
    setSearchParams(next === 'break-2' ? { catalog: 'break2' } : {}, {
      replace: true,
    });
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: GlBreakSummaryDto) => {
    setEditingRecord(record);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingRecord(null);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = (body: GlBreakCreateDto) => {
    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, body },
        { onSuccess: closeDialog },
      );
      return;
    }
    createMutation.mutate(body, { onSuccess: closeDialog });
  };

  const isBreakTwo = catalog === 'break-2';

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="business-unit"
    >
      <BusinessUnitHeader catalog={catalog} />

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
          activeBreakTwoCount={
            activeLookup.isSuccess ? activeBreakTwoCount : undefined
          }
          activeBusinessUnitCount={
            activeLookup.isSuccess ? activeBusinessUnitCount : undefined
          }
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
        />
        <GlBreakTablePanel
          key={catalog}
          activeCount={
            isBreakTwo ? activeBreakTwoCount : activeBusinessUnitCount
          }
          addLabel={isBreakTwo ? ADD_BREAK_TWO_LABEL : ADD_BUSINESS_UNIT_LABEL}
          breakLevel={breakLevel}
          inactiveCount={
            isBreakTwo ? inactiveBreakTwoCount : inactiveBusinessUnitCount
          }
          nameHeader={isBreakTwo ? 'Name' : 'Business Unit'}
          onAdd={handleAdd}
          onEdit={handleEdit}
          queryClient={queryClient}
          tableLabel={isBreakTwo ? 'Break 2' : 'Business units'}
        />
      </div>

      <Suspense fallback={null}>
        <GlBreakFormDialog
          breakLevel={breakLevel}
          catalog={catalog}
          isPending={createMutation.isPending || updateMutation.isPending}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleSubmit}
          open={dialogOpen}
          record={editingRecord}
        />
      </Suspense>
    </section>
  );
};
