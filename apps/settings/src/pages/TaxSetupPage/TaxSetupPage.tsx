import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';
import type {
  TaxAuthorityCreateDto,
  TaxAuthoritySummaryDto,
  TaxCreateDto,
  TaxSummaryDto,
} from '@cms/settings-contract';
import {
  createTaxAuthorityMutationOptions,
  createTaxMutationOptions,
  patchTaxAuthorityMutationOptions,
  patchTaxMutationOptions,
  taxAuthorityLookupQueryOptions,
  taxLookupQueryOptions,
  updateTaxAuthorityMutationOptions,
  updateTaxMutationOptions,
} from '@cms/settings-data-access';
import { Callout } from '@cms/ui';
import {
  CatalogNavPanel,
  TaxAuthorityFormDialog,
  TaxAuthorityTablePanel,
  TaxCodeFormDialog,
  TaxCodeTablePanel,
  TaxSetupHeader,
} from './component';
import type { TaxCatalog } from './types';
import { catalogFromSearch, describeTaxError } from './util';

export interface TaxSetupPageProps {
  queryClient: QueryClient;
}

export function TaxSetupPage({ queryClient }: TaxSetupPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const [authorityDialogOpen, setAuthorityDialogOpen] = useState(false);
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [editingAuthority, setEditingAuthority] =
    useState<TaxAuthoritySummaryDto | null>(null);
  const [editingTax, setEditingTax] = useState<TaxSummaryDto | null>(null);

  const activeAuthorityLookup = useQuery(
    taxAuthorityLookupQueryOptions(true),
    queryClient,
  );
  const allAuthorityLookup = useQuery(
    taxAuthorityLookupQueryOptions(false),
    queryClient,
  );
  const activeTaxLookup = useQuery(taxLookupQueryOptions(true), queryClient);
  const allTaxLookup = useQuery(taxLookupQueryOptions(false), queryClient);
  const createAuthorityMutation = useMutation(
    createTaxAuthorityMutationOptions(queryClient),
    queryClient,
  );
  const updateAuthorityMutation = useMutation(
    updateTaxAuthorityMutationOptions(queryClient),
    queryClient,
  );
  const patchAuthorityMutation = useMutation(
    patchTaxAuthorityMutationOptions(queryClient),
    queryClient,
  );
  const createTaxMutation = useMutation(
    createTaxMutationOptions(queryClient),
    queryClient,
  );
  const updateTaxMutation = useMutation(
    updateTaxMutationOptions(queryClient),
    queryClient,
  );
  const patchTaxMutation = useMutation(
    patchTaxMutationOptions(queryClient),
    queryClient,
  );

  const activeAuthorityCount = activeAuthorityLookup.data?.length ?? 0;
  const inactiveAuthorityCount = Math.max(
    0,
    (allAuthorityLookup.data?.length ?? 0) - activeAuthorityCount,
  );
  const activeTaxCount = activeTaxLookup.data?.length ?? 0;
  const inactiveTaxCount = Math.max(
    0,
    (allTaxLookup.data?.length ?? 0) - activeTaxCount,
  );
  const saveMessage = updateTaxMutation.isSuccess
    ? 'Tax rate updated'
    : createTaxMutation.isSuccess
      ? 'Tax rate created'
      : patchTaxMutation.isSuccess
        ? 'Tax rate updated'
        : updateAuthorityMutation.isSuccess
          ? 'Tax authority updated'
          : createAuthorityMutation.isSuccess
            ? 'Tax authority created'
            : patchAuthorityMutation.isSuccess
              ? 'Tax authority updated'
              : null;
  const writeError =
    createAuthorityMutation.error ??
    updateAuthorityMutation.error ??
    patchAuthorityMutation.error ??
    createTaxMutation.error ??
    updateTaxMutation.error ??
    patchTaxMutation.error;

  function openCreate() {
    if (catalog === 'tax-code') {
      setEditingTax(null);
      setTaxDialogOpen(true);
      return;
    }
    setEditingAuthority(null);
    setAuthorityDialogOpen(true);
  }

  function openEditAuthority(authority: TaxAuthoritySummaryDto) {
    setEditingAuthority(authority);
    setAuthorityDialogOpen(true);
  }

  function openEditTax(tax: TaxSummaryDto) {
    setEditingTax(tax);
    setTaxDialogOpen(true);
  }

  function closeAuthorityDialog() {
    setAuthorityDialogOpen(false);
  }

  function closeTaxDialog() {
    setTaxDialogOpen(false);
  }

  function handleCatalogChange(next: TaxCatalog) {
    setSearchParams(next === 'tax-code' ? { catalog: 'tax-code' } : {}, {
      replace: true,
    });
  }

  function handleAuthorityDialogOpenChange(open: boolean) {
    setAuthorityDialogOpen(open);
    if (!open) setEditingAuthority(null);
  }

  function handleTaxDialogOpenChange(open: boolean) {
    setTaxDialogOpen(open);
    if (!open) setEditingTax(null);
  }

  function handleAuthoritySubmit(
    body: TaxAuthorityCreateDto,
    isActive: boolean,
  ) {
    if (editingAuthority) {
      updateAuthorityMutation.mutate(
        { id: editingAuthority.id, body },
        {
          onSuccess: () => {
            if (editingAuthority.isActive === isActive) {
              closeAuthorityDialog();
              return;
            }
            patchAuthorityMutation.mutate(
              { id: editingAuthority.id, body: { isActive } },
              { onSuccess: closeAuthorityDialog },
            );
          },
        },
      );
      return;
    }
    createAuthorityMutation.mutate(body, {
      onSuccess: (created) => {
        if (isActive) {
          closeAuthorityDialog();
          return;
        }
        patchAuthorityMutation.mutate(
          { id: created.id, body: { isActive: false } },
          { onSuccess: closeAuthorityDialog },
        );
      },
    });
  }

  function handleTaxSubmit(body: TaxCreateDto, isActive: boolean) {
    if (editingTax) {
      updateTaxMutation.mutate(
        { id: editingTax.id, body },
        {
          onSuccess: () => {
            if (editingTax.isActive === isActive) {
              closeTaxDialog();
              return;
            }
            patchTaxMutation.mutate(
              { id: editingTax.id, body: { isActive } },
              { onSuccess: closeTaxDialog },
            );
          },
        },
      );
      return;
    }
    createTaxMutation.mutate(body, {
      onSuccess: (created) => {
        if (isActive) {
          closeTaxDialog();
          return;
        }
        patchTaxMutation.mutate(
          { id: created.id, body: { isActive: false } },
          { onSuccess: closeTaxDialog },
        );
      },
    });
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="tax-setup"
    >
      <TaxSetupHeader catalog={catalog} onAdd={openCreate} />

      {saveMessage ? (
        <Callout title="Saved" variant="success">
          {saveMessage}
        </Callout>
      ) : null}
      {writeError ? (
        <Callout title="Could not save" variant="error">
          {describeTaxError(writeError)}
        </Callout>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:flex-row">
        <CatalogNavPanel
          activeAuthorityCount={
            activeAuthorityLookup.isSuccess ? activeAuthorityCount : undefined
          }
          activeTaxCodeCount={
            activeTaxLookup.isSuccess ? activeTaxCount : undefined
          }
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
        />
        {catalog === 'tax-code' ? (
          <TaxCodeTablePanel
            activeCount={activeTaxCount}
            inactiveCount={inactiveTaxCount}
            onEdit={openEditTax}
            queryClient={queryClient}
          />
        ) : (
          <TaxAuthorityTablePanel
            activeCount={activeAuthorityCount}
            inactiveCount={inactiveAuthorityCount}
            onEdit={openEditAuthority}
            queryClient={queryClient}
          />
        )}
      </div>

      <TaxAuthorityFormDialog
        authority={editingAuthority}
        isPending={
          createAuthorityMutation.isPending ||
          updateAuthorityMutation.isPending ||
          patchAuthorityMutation.isPending
        }
        onOpenChange={handleAuthorityDialogOpenChange}
        onSubmit={handleAuthoritySubmit}
        open={authorityDialogOpen}
      />
      <TaxCodeFormDialog
        isPending={
          createTaxMutation.isPending ||
          updateTaxMutation.isPending ||
          patchTaxMutation.isPending
        }
        onOpenChange={handleTaxDialogOpenChange}
        onSubmit={handleTaxSubmit}
        open={taxDialogOpen}
        tax={editingTax}
      />
    </section>
  );
}
