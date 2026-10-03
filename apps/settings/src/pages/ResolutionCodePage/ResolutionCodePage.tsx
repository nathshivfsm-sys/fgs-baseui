import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ResolutionCodeSummaryDto } from '@cms/settings-contract';
import {
  createResolutionCodeMutationOptions,
  patchResolutionCodeMutationOptions,
  resolutionCodeListQueryOptions,
  toResolutionCodeCreateDto,
  toResolutionCodeUpdateDto,
  updateResolutionCodeMutationOptions,
  type ResolutionCodeForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  ResolutionCodeDeactivateDialog,
  ResolutionCodeFormDialog,
  ResolutionCodeHeader,
  ResolutionCodeTablePanel,
} from './component';
import {
  CREATE_SUCCESS_MESSAGE,
  CREATE_SUCCESS_TITLE,
  DEACTIVATE_ERROR_TITLE,
  DEACTIVATE_SUCCESS_MESSAGE,
  DEACTIVATE_SUCCESS_TITLE,
  SAVE_ERROR_TITLE,
  UPDATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_TITLE,
} from './constant';
import type {
  ResolutionCodeListFilters,
  ResolutionCodePageProps,
} from './types';
import { emptyResolutionCodeListFilters } from './types';
import { describeResolutionCodeError } from './util';

export const ResolutionCodePage = ({
  queryClient,
}: ResolutionCodePageProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<ResolutionCodeSummaryDto | null>(null);
  const [deactivatingRecord, setDeactivatingRecord] =
    useState<ResolutionCodeSummaryDto | null>(null);
  const [appliedFilters, setAppliedFilters] =
    useState<ResolutionCodeListFilters>(emptyResolutionCodeListFilters());

  const activeCountQuery = useQuery(
    resolutionCodeListQueryOptions({ page: 1, pageSize: 1, isActive: true }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    resolutionCodeListQueryOptions({ page: 1, pageSize: 1, isActive: false }),
    queryClient,
  );
  const createMutation = useMutation(
    createResolutionCodeMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateResolutionCodeMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchResolutionCodeMutationOptions(queryClient),
    queryClient,
  );

  const formPending = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: ResolutionCodeSummaryDto) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDeactivate = (record: ResolutionCodeSummaryDto) => {
    if (!record.isActive) return;
    setDeactivatingRecord(record);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingRecord(null);
  };

  const handleDeactivateOpenChange = (open: boolean) => {
    if (!open) setDeactivatingRecord(null);
  };

  const handleFiltersApply = (filters: ResolutionCodeListFilters) => {
    setAppliedFilters(filters);
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyResolutionCodeListFilters());
  };

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeResolutionCodeError(error),
    });
  };

  const handleFormSubmit = (values: ResolutionCodeForm) => {
    if (formPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toResolutionCodeUpdateDto(values),
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
    createMutation.mutate(toResolutionCodeCreateDto(values), {
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
            description: describeResolutionCodeError(error),
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
      data-testid="resolutionCode-page"
    >
      <ResolutionCodeHeader onAdd={handleAdd} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <ResolutionCodeTablePanel
          activeCount={activeCountQuery.data?.totalCount ?? 0}
          appliedFilters={appliedFilters}
          inactiveCount={inactiveCountQuery.data?.totalCount ?? 0}
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          onFiltersApply={handleFiltersApply}
          onFiltersClear={handleFiltersClear}
          queryClient={queryClient}
        />
      </div>
      <ResolutionCodeFormDialog
        isPending={formPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        resolutionCode={editingRecord}
      />
      <ResolutionCodeDeactivateDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivatingRecord != null}
        resolutionCode={deactivatingRecord}
      />
    </section>
  );
};
