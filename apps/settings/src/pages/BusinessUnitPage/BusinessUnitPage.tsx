import { lazy, Suspense, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type {
  GlBreakDetailDto,
  GlBreakSummaryDto,
} from '@cms/settings-contract';
import {
  createGlBreakMutationOptions,
  glBreakDetailQueryOptions,
  glBreakLookupQueryOptions,
  patchGlBreakMutationOptions,
  techTradeLookupQueryOptions,
  updateGlBreakMutationOptions,
} from '@cms/settings-data-access';
import { Callout, type SelectOption } from '@cms/ui';
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
import type {
  BusinessUnitCatalog,
  BusinessUnitPageProps,
  GlBreakFormSubmit,
} from './types';
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
  const tradeLookup = useQuery(techTradeLookupQueryOptions(true), queryClient);
  const detailQuery = useQuery(
    {
      ...glBreakDetailQueryOptions(editingRecord?.id ?? 0),
      enabled: dialogOpen && editingRecord != null,
    },
    queryClient,
  );
  const createMutation = useMutation(
    createGlBreakMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateGlBreakMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchGlBreakMutationOptions(queryClient),
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

  const tradeOptions = useMemo((): readonly SelectOption[] => {
    return (tradeLookup.data ?? [])
      .filter((item) => Boolean(item.tradeCode))
      .map((item) => ({
        value: item.tradeCode as string,
        label: item.name || item.tradeCode || '',
      }));
  }, [tradeLookup.data]);

  const saveMessage = updateMutation.isSuccess
    ? catalog === 'break-2'
      ? 'Break 2 updated'
      : 'Business unit updated'
    : createMutation.isSuccess
      ? catalog === 'break-2'
        ? 'Break 2 created'
        : 'Business unit created'
      : null;
  const writeError =
    createMutation.error ?? updateMutation.error ?? patchMutation.error;
  const writeErrorCopy = writeError ? describeGlBreakError(writeError) : null;

  const resetWrites = () => {
    createMutation.reset();
    updateMutation.reset();
    patchMutation.reset();
  };

  const handleCatalogChange = (next: BusinessUnitCatalog) => {
    resetWrites();
    setSearchParams(next === 'break-2' ? { catalog: 'break2' } : {}, {
      replace: true,
    });
  };

  const handleAdd = () => {
    resetWrites();
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

  const handleSubmit = (payload: GlBreakFormSubmit) => {
    const afterWrite = (saved: GlBreakDetailDto) => {
      if (saved.isActive === payload.isActive) {
        closeDialog();
        return;
      }
      patchMutation.mutate(
        { id: saved.id, body: { isActive: payload.isActive } },
        { onSuccess: closeDialog },
      );
    };

    if (editingRecord) {
      updateMutation.mutate(
        { id: editingRecord.id, body: payload.body },
        { onSuccess: afterWrite },
      );
      return;
    }
    createMutation.mutate(payload.body, { onSuccess: afterWrite });
  };

  const isBreakTwo = catalog === 'break-2';
  const isWritePending =
    createMutation.isPending ||
    updateMutation.isPending ||
    patchMutation.isPending ||
    (dialogOpen && editingRecord != null && detailQuery.isPending);

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
          isPending={isWritePending}
          onOpenChange={handleDialogOpenChange}
          onSubmit={handleSubmit}
          open={dialogOpen}
          record={detailQuery.data ?? editingRecord}
          tradeOptions={tradeOptions}
        />
      </Suspense>
    </section>
  );
};
