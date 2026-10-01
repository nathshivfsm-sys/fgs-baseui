import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { BillingCategorySummaryDto } from '@cms/settings-contract';
import {
  createBillingCategoryMutationOptions,
  patchBillingCategoryMutationOptions,
  updateBillingCategoryMutationOptions,
  billingCategoryListQueryOptions,
  toBillingCategoryCreateDto,
  toBillingCategoryUpdateDto,
  type BillingCategoryForm,
} from '@cms/settings-data-access';
import { gloBillingCategoryTypeLookupQueryOptions } from '@cms/shared-data-access';
import { alert } from '@cms/ui';
import {
  BillingCategoryDeactivateDialog,
  BillingCategoryFormDialog,
  BillingCategoryHeader,
  BillingCategoryTablePanel,
} from './component';
import {
  CREATE_SUCCESS_MESSAGE,
  CREATE_SUCCESS_TITLE,
  DEACTIVATE_ERROR_TITLE,
  DEACTIVATE_SUCCESS_MESSAGE,
  DEACTIVATE_SUCCESS_TITLE,
  SAVE_ERROR_TITLE,
  SYSTEM_DEFINED_EDIT_BLOCKED,
  UPDATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_TITLE,
} from './constant';
import type {
  BillingCategoryListFilters,
  BillingCategoryPageProps,
} from './types';
import { emptyBillingCategoryListFilters } from './types';
import { describeBillingCategoryError } from './util';

export const BillingCategoryPage = ({
  queryClient,
}: BillingCategoryPageProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<BillingCategorySummaryDto | null>(null);
  const [deactivatingRecord, setDeactivatingRecord] =
    useState<BillingCategorySummaryDto | null>(null);
  const [appliedFilters, setAppliedFilters] =
    useState<BillingCategoryListFilters>(emptyBillingCategoryListFilters());

  const activeCountQuery = useQuery(
    billingCategoryListQueryOptions({
      page: 1,
      pageSize: 1,
      isActive: true,
    }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    billingCategoryListQueryOptions({
      page: 1,
      pageSize: 1,
      isActive: false,
    }),
    queryClient,
  );
  const typeLookupQuery = useQuery(
    gloBillingCategoryTypeLookupQueryOptions(true),
    queryClient,
  );
  const createMutation = useMutation(
    createBillingCategoryMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateBillingCategoryMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchBillingCategoryMutationOptions(queryClient),
    queryClient,
  );

  const activeCount = activeCountQuery.data?.totalCount ?? 0;
  const inactiveCount = inactiveCountQuery.data?.totalCount ?? 0;
  const formPending = createMutation.isPending || updateMutation.isPending;
  const deactivateOpen = deactivatingRecord != null;

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: BillingCategorySummaryDto) => {
    if (record.isSystemDefined) {
      alert.error(SYSTEM_DEFINED_EDIT_BLOCKED);
      return;
    }
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDeactivate = (record: BillingCategorySummaryDto) => {
    if (record.isSystemDefined || !record.isActive) return;
    setDeactivatingRecord(record);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingRecord(null);
    }
  };

  const handleDeactivateOpenChange = (open: boolean) => {
    if (!open) {
      setDeactivatingRecord(null);
    }
  };

  const handleFiltersApply = (filters: BillingCategoryListFilters) => {
    setAppliedFilters(filters);
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyBillingCategoryListFilters());
  };

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeBillingCategoryError(error),
    });
  };

  const handleFormSubmit = (values: BillingCategoryForm) => {
    if (formPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toBillingCategoryUpdateDto(values, editingRecord),
        },
        {
          onError: handleWriteError,
          onSuccess: () => {
            alert.success(UPDATE_SUCCESS_TITLE, {
              description: UPDATE_SUCCESS_MESSAGE,
            });
            setFormOpen(false);
            setEditingRecord(null);
          },
        },
      );
      return;
    }
    createMutation.mutate(toBillingCategoryCreateDto(values), {
      onError: handleWriteError,
      onSuccess: () => {
        alert.success(CREATE_SUCCESS_TITLE, {
          description: CREATE_SUCCESS_MESSAGE,
        });
        setFormOpen(false);
      },
    });
  };

  const handleDeactivateConfirm = () => {
    if (!deactivatingRecord || patchMutation.isPending) return;
    patchMutation.mutate(
      { id: deactivatingRecord.id, body: { isActive: false } },
      {
        onError: (error) => {
          alert.error(DEACTIVATE_ERROR_TITLE, {
            description: describeBillingCategoryError(error),
          });
        },
        onSuccess: () => {
          alert.success(DEACTIVATE_SUCCESS_TITLE, {
            description: DEACTIVATE_SUCCESS_MESSAGE,
          });
          setDeactivatingRecord(null);
        },
      },
    );
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4"
      data-testid="billing-category-page"
    >
      <BillingCategoryHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <BillingCategoryTablePanel
          activeCount={activeCount}
          appliedFilters={appliedFilters}
          inactiveCount={inactiveCount}
          onAdd={handleAdd}
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          onFiltersApply={handleFiltersApply}
          onFiltersClear={handleFiltersClear}
          queryClient={queryClient}
          typeOptions={typeLookupQuery.data}
        />
      </div>
      <BillingCategoryFormDialog
        billingCategory={editingRecord}
        isPending={formPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        typeOptions={typeLookupQuery.data}
      />
      <BillingCategoryDeactivateDialog
        billingCategory={deactivatingRecord}
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivateOpen}
      />
    </section>
  );
};
