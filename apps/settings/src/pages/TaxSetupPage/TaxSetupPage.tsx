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
import { alert } from '@cms/ui';
import {
  CatalogNavPanel,
  TaxAuthorityFormDialog,
  TaxAuthorityTablePanel,
  TaxCodeFormDialog,
  TaxCodeTablePanel,
  TaxSetupHeader,
} from './component';
import {
  AUTHORITY_CREATED_MESSAGE,
  AUTHORITY_UPDATED_MESSAGE,
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_TITLE,
  TAX_CREATED_MESSAGE,
  TAX_UPDATED_MESSAGE,
} from './constant';
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

  function handleAuthorityCreated() {
    closeAuthorityDialog();
    alert.success(SAVE_SUCCESS_TITLE, {
      description: AUTHORITY_CREATED_MESSAGE,
    });
  }

  function handleAuthorityUpdated() {
    closeAuthorityDialog();
    alert.success(SAVE_SUCCESS_TITLE, {
      description: AUTHORITY_UPDATED_MESSAGE,
    });
  }

  function handleAuthorityWriteError(error: unknown) {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeTaxError(error),
    });
  }

  function handleTaxCreated() {
    closeTaxDialog();
    alert.success(SAVE_SUCCESS_TITLE, { description: TAX_CREATED_MESSAGE });
  }

  function handleTaxUpdated() {
    closeTaxDialog();
    alert.success(SAVE_SUCCESS_TITLE, { description: TAX_UPDATED_MESSAGE });
  }

  function handleTaxWriteError(error: unknown) {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeTaxError(error),
    });
  }

  function handleAuthoritySubmit(
    body: TaxAuthorityCreateDto,
    isActive: boolean,
  ) {
    if (editingAuthority) {
      const handleUpdated = () => {
        if (editingAuthority.isActive === isActive) {
          handleAuthorityUpdated();
          return;
        }
        patchAuthorityMutation.mutate(
          { id: editingAuthority.id, body: { isActive } },
          {
            onError: handleAuthorityWriteError,
            onSuccess: handleAuthorityUpdated,
          },
        );
      };
      updateAuthorityMutation.mutate(
        { id: editingAuthority.id, body },
        { onError: handleAuthorityWriteError, onSuccess: handleUpdated },
      );
      return;
    }
    const handleCreated = (created: TaxAuthoritySummaryDto) => {
      if (isActive) {
        handleAuthorityCreated();
        return;
      }
      patchAuthorityMutation.mutate(
        { id: created.id, body: { isActive: false } },
        {
          onError: handleAuthorityWriteError,
          onSuccess: handleAuthorityCreated,
        },
      );
    };
    createAuthorityMutation.mutate(body, {
      onError: handleAuthorityWriteError,
      onSuccess: handleCreated,
    });
  }

  function handleTaxSubmit(body: TaxCreateDto, isActive: boolean) {
    if (editingTax) {
      const handleUpdated = () => {
        if (editingTax.isActive === isActive) {
          handleTaxUpdated();
          return;
        }
        patchTaxMutation.mutate(
          { id: editingTax.id, body: { isActive } },
          { onError: handleTaxWriteError, onSuccess: handleTaxUpdated },
        );
      };
      updateTaxMutation.mutate(
        { id: editingTax.id, body },
        { onError: handleTaxWriteError, onSuccess: handleUpdated },
      );
      return;
    }
    const handleCreated = (created: TaxSummaryDto) => {
      if (isActive) {
        handleTaxCreated();
        return;
      }
      patchTaxMutation.mutate(
        { id: created.id, body: { isActive: false } },
        { onError: handleTaxWriteError, onSuccess: handleTaxCreated },
      );
    };
    createTaxMutation.mutate(body, {
      onError: handleTaxWriteError,
      onSuccess: handleCreated,
    });
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="tax-setup"
    >
      <TaxSetupHeader />

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
            onAdd={openCreate}
            onEdit={openEditTax}
            queryClient={queryClient}
          />
        ) : (
          <TaxAuthorityTablePanel
            activeCount={activeAuthorityCount}
            inactiveCount={inactiveAuthorityCount}
            onAdd={openCreate}
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
        queryClient={queryClient}
        tax={editingTax}
      />
    </section>
  );
}
