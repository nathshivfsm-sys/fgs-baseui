import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import type {
  SalesActivityOutcomeDetailDto,
  SalesActivityOutcomeSummaryDto,
  SalesActivityTypeDetailDto,
  SalesActivityTypeSummaryDto,
} from '@cms/settings-contract';
import {
  createSalesActivityOutcomeMutationOptions,
  createSalesActivityTypeMutationOptions,
  patchSalesActivityOutcomeMutationOptions,
  patchSalesActivityTypeMutationOptions,
  salesActivityOutcomeListQueryOptions,
  salesActivityTypeListQueryOptions,
  salesPipelineStatusLookupQueryOptions,
  toSalesActivityOutcomeCreateDto,
  toSalesActivityOutcomeUpdateDto,
  toSalesActivityTypeCreateDto,
  toSalesActivityTypeUpdateDto,
  updateSalesActivityOutcomeMutationOptions,
  updateSalesActivityTypeMutationOptions,
  type SalesActivityOutcomeForm,
  type SalesActivityTypeForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  SalesActivitiesHeader,
  SalesActivitiesNavPanel,
  SalesActivityDeleteDialog,
  SalesActivityFormDialog,
  SalesActivityOutcomeFormDialog,
  SalesActivityOutcomeTablePanel,
  SalesActivityTablePanel,
} from './component';
import {
  CREATE_ACTIVITY_LABEL,
  CREATE_ACTIVITY_SUCCESS_MESSAGE,
  CREATE_ACTIVITY_SUCCESS_TITLE,
  CREATE_OUTCOME_LABEL,
  CREATE_OUTCOME_SUCCESS_MESSAGE,
  CREATE_OUTCOME_SUCCESS_TITLE,
  DELETE_ACTIVITY_ERROR_TITLE,
  DELETE_ACTIVITY_SUCCESS_MESSAGE,
  DELETE_ACTIVITY_SUCCESS_TITLE,
  DELETE_ACTIVITY_TITLE,
  DELETE_OUTCOME_ERROR_TITLE,
  DELETE_OUTCOME_SUCCESS_MESSAGE,
  DELETE_OUTCOME_SUCCESS_TITLE,
  DELETE_OUTCOME_TITLE,
  SALES_ACTIVITIES_LIST_PAGE_SIZE,
  SAVE_ACTIVITY_ERROR_TITLE,
  SAVE_OUTCOME_ERROR_TITLE,
  UPDATE_ACTIVITY_SUCCESS_MESSAGE,
  UPDATE_ACTIVITY_SUCCESS_TITLE,
  UPDATE_OUTCOME_SUCCESS_MESSAGE,
  UPDATE_OUTCOME_SUCCESS_TITLE,
} from './constant';
import type { SalesActivitiesPageProps } from './types';
import {
  catalogFromSearch,
  countByActive,
  describeSalesActivityError,
  describeSalesActivityOutcomeError,
} from './util';

const LIST_PARAMS = {
  page: 1,
  pageSize: SALES_ACTIVITIES_LIST_PAGE_SIZE,
} as const;

export const SalesActivitiesPage = ({
  queryClient,
}: SalesActivitiesPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const catalog = catalogFromSearch(searchParams.get('catalog'));
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [outcomeFormOpen, setOutcomeFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] =
    useState<SalesActivityTypeSummaryDto | null>(null);
  const [editingOutcome, setEditingOutcome] =
    useState<SalesActivityOutcomeSummaryDto | null>(null);
  const [deletingActivity, setDeletingActivity] =
    useState<SalesActivityTypeSummaryDto | null>(null);
  const [deletingOutcome, setDeletingOutcome] =
    useState<SalesActivityOutcomeSummaryDto | null>(null);

  const activityQuery = useQuery(
    salesActivityTypeListQueryOptions(LIST_PARAMS),
    queryClient,
  );
  const outcomeQuery = useQuery(
    salesActivityOutcomeListQueryOptions(LIST_PARAMS),
    queryClient,
  );
  const statusLookupQuery = useQuery(
    {
      ...salesPipelineStatusLookupQueryOptions(false),
      enabled: catalog === 'outcome',
    },
    queryClient,
  );

  const createActivityMutation = useMutation(
    createSalesActivityTypeMutationOptions(queryClient),
    queryClient,
  );
  const updateActivityMutation = useMutation(
    updateSalesActivityTypeMutationOptions(queryClient),
    queryClient,
  );
  const patchActivityMutation = useMutation(
    patchSalesActivityTypeMutationOptions(queryClient),
    queryClient,
  );
  const createOutcomeMutation = useMutation(
    createSalesActivityOutcomeMutationOptions(queryClient),
    queryClient,
  );
  const updateOutcomeMutation = useMutation(
    updateSalesActivityOutcomeMutationOptions(queryClient),
    queryClient,
  );
  const patchOutcomeMutation = useMutation(
    patchSalesActivityOutcomeMutationOptions(queryClient),
    queryClient,
  );

  const activityItems = activityQuery.data?.items ?? [];
  const outcomeItems = outcomeQuery.data?.items ?? [];
  const activityCounts = useMemo(
    () => countByActive(activityItems),
    [activityItems],
  );
  const outcomeCounts = useMemo(
    () => countByActive(outcomeItems),
    [outcomeItems],
  );
  const statusCodeById = useMemo(() => {
    const codes = new Map<number, string>();
    for (const status of statusLookupQuery.data ?? []) {
      const label = status.statusCode?.trim() || status.statusName?.trim();
      if (label) codes.set(status.id, label);
    }
    return codes;
  }, [statusLookupQuery.data]);

  const activityPending =
    createActivityMutation.isPending ||
    updateActivityMutation.isPending ||
    patchActivityMutation.isPending;
  const outcomePending =
    createOutcomeMutation.isPending ||
    updateOutcomeMutation.isPending ||
    patchOutcomeMutation.isPending;

  const handleCatalogChange = (next: 'activity' | 'outcome') => {
    setActivityFormOpen(false);
    setOutcomeFormOpen(false);
    setEditingActivity(null);
    setEditingOutcome(null);
    setDeletingActivity(null);
    setDeletingOutcome(null);
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === 'activity') {
          params.delete('catalog');
        } else {
          params.set('catalog', next);
        }
        return params;
      },
      { replace: true },
    );
  };

  const handleAdd = () => {
    if (catalog === 'outcome') {
      setEditingOutcome(null);
      setOutcomeFormOpen(true);
      return;
    }
    setEditingActivity(null);
    setActivityFormOpen(true);
  };

  const handleEditActivity = (record: SalesActivityTypeSummaryDto) => {
    setEditingActivity(record);
    setActivityFormOpen(true);
  };

  const handleEditOutcome = (record: SalesActivityOutcomeSummaryDto) => {
    setEditingOutcome(record);
    setOutcomeFormOpen(true);
  };

  const handleDeleteActivity = (record: SalesActivityTypeSummaryDto) => {
    if (!record.isActive) return;
    setDeletingActivity(record);
  };

  const handleDeleteOutcome = (record: SalesActivityOutcomeSummaryDto) => {
    if (!record.isActive) return;
    setDeletingOutcome(record);
  };

  const handleActivityFormOpenChange = (open: boolean) => {
    setActivityFormOpen(open);
    if (!open) setEditingActivity(null);
  };

  const handleOutcomeFormOpenChange = (open: boolean) => {
    setOutcomeFormOpen(open);
    if (!open) setEditingOutcome(null);
  };

  const handleActivityDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingActivity(null);
  };

  const handleOutcomeDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingOutcome(null);
  };

  const handleActivityWriteError = (error: unknown) => {
    alert.error(SAVE_ACTIVITY_ERROR_TITLE, {
      description: describeSalesActivityError(error),
    });
  };

  const handleOutcomeWriteError = (error: unknown) => {
    alert.error(SAVE_OUTCOME_ERROR_TITLE, {
      description: describeSalesActivityOutcomeError(error),
    });
  };

  const syncActivityStatus = (
    record: SalesActivityTypeDetailDto,
    isActive: boolean,
    onDone: () => void,
  ) => {
    if (record.isActive === isActive) {
      onDone();
      return;
    }
    patchActivityMutation.mutate(
      { id: record.id, body: { isActive } },
      { onError: handleActivityWriteError, onSuccess: onDone },
    );
  };

  const syncOutcomeStatus = (
    record: SalesActivityOutcomeDetailDto,
    isActive: boolean,
    onDone: () => void,
  ) => {
    if (record.isActive === isActive) {
      onDone();
      return;
    }
    patchOutcomeMutation.mutate(
      { id: record.id, body: { isActive } },
      { onError: handleOutcomeWriteError, onSuccess: onDone },
    );
  };

  const handleActivitySubmit = (values: SalesActivityTypeForm) => {
    if (activityPending) return;
    if (editingActivity) {
      updateActivityMutation.mutate(
        {
          id: editingActivity.id,
          body: toSalesActivityTypeUpdateDto(values, editingActivity),
        },
        {
          onError: handleActivityWriteError,
          onSuccess: (updated) => {
            syncActivityStatus(updated, values.isActive, () => {
              alert.success(UPDATE_ACTIVITY_SUCCESS_TITLE, {
                description: UPDATE_ACTIVITY_SUCCESS_MESSAGE,
              });
              setActivityFormOpen(false);
              setEditingActivity(null);
            });
          },
        },
      );
      return;
    }
    createActivityMutation.mutate(toSalesActivityTypeCreateDto(values), {
      onError: handleActivityWriteError,
      onSuccess: (created) => {
        syncActivityStatus(created, values.isActive, () => {
          alert.success(CREATE_ACTIVITY_SUCCESS_TITLE, {
            description: CREATE_ACTIVITY_SUCCESS_MESSAGE,
          });
          setActivityFormOpen(false);
        });
      },
    });
  };

  const handleOutcomeSubmit = (values: SalesActivityOutcomeForm) => {
    if (outcomePending) return;
    if (editingOutcome) {
      updateOutcomeMutation.mutate(
        {
          id: editingOutcome.id,
          body: toSalesActivityOutcomeUpdateDto(values, editingOutcome),
        },
        {
          onError: handleOutcomeWriteError,
          onSuccess: (updated) => {
            syncOutcomeStatus(updated, values.isActive, () => {
              alert.success(UPDATE_OUTCOME_SUCCESS_TITLE, {
                description: UPDATE_OUTCOME_SUCCESS_MESSAGE,
              });
              setOutcomeFormOpen(false);
              setEditingOutcome(null);
            });
          },
        },
      );
      return;
    }
    createOutcomeMutation.mutate(toSalesActivityOutcomeCreateDto(values), {
      onError: handleOutcomeWriteError,
      onSuccess: (created) => {
        syncOutcomeStatus(created, values.isActive, () => {
          alert.success(CREATE_OUTCOME_SUCCESS_TITLE, {
            description: CREATE_OUTCOME_SUCCESS_MESSAGE,
          });
          setOutcomeFormOpen(false);
        });
      },
    });
  };

  const handleActivityDeleteConfirm = () => {
    if (!deletingActivity || patchActivityMutation.isPending) return;
    patchActivityMutation.mutate(
      { id: deletingActivity.id, body: { isActive: false } },
      {
        onError: (error) => {
          alert.error(DELETE_ACTIVITY_ERROR_TITLE, {
            description: describeSalesActivityError(error),
          });
        },
        onSuccess: () => {
          alert.success(DELETE_ACTIVITY_SUCCESS_TITLE, {
            description: DELETE_ACTIVITY_SUCCESS_MESSAGE,
          });
          setDeletingActivity(null);
        },
      },
    );
  };

  const handleOutcomeDeleteConfirm = () => {
    if (!deletingOutcome || patchOutcomeMutation.isPending) return;
    patchOutcomeMutation.mutate(
      { id: deletingOutcome.id, body: { isActive: false } },
      {
        onError: (error) => {
          alert.error(DELETE_OUTCOME_ERROR_TITLE, {
            description: describeSalesActivityOutcomeError(error),
          });
        },
        onSuccess: () => {
          alert.success(DELETE_OUTCOME_SUCCESS_TITLE, {
            description: DELETE_OUTCOME_SUCCESS_MESSAGE,
          });
          setDeletingOutcome(null);
        },
      },
    );
  };

  const deletingName =
    catalog === 'outcome'
      ? deletingOutcome?.outcomeName?.trim() ||
        deletingOutcome?.outcomeCode?.trim() ||
        'this outcome'
      : deletingActivity?.activityTypeName?.trim() ||
        deletingActivity?.activityTypeCode?.trim() ||
        'this activity';

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="sales-activities-page"
    >
      <SalesActivitiesHeader
        createLabel={
          catalog === 'outcome' ? CREATE_OUTCOME_LABEL : CREATE_ACTIVITY_LABEL
        }
        onAdd={handleAdd}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface lg:flex-row">
        <SalesActivitiesNavPanel
          activityActiveCount={
            activityQuery.isSuccess ? activityCounts.active : undefined
          }
          activityInactiveCount={
            activityQuery.isSuccess ? activityCounts.inactive : undefined
          }
          catalog={catalog}
          onCatalogChange={handleCatalogChange}
          outcomeActiveCount={
            outcomeQuery.isSuccess ? outcomeCounts.active : undefined
          }
          outcomeInactiveCount={
            outcomeQuery.isSuccess ? outcomeCounts.inactive : undefined
          }
        />
        {catalog === 'outcome' ? (
          <SalesActivityOutcomeTablePanel
            activeCount={outcomeCounts.active}
            error={outcomeQuery.error}
            inactiveCount={outcomeCounts.inactive}
            isError={outcomeQuery.isError}
            isFetching={outcomeQuery.isFetching && !outcomeQuery.isPending}
            isPending={outcomeQuery.isPending}
            items={outcomeItems}
            onDelete={handleDeleteOutcome}
            onEdit={handleEditOutcome}
            statusCodeById={statusCodeById}
          />
        ) : (
          <SalesActivityTablePanel
            activeCount={activityCounts.active}
            error={activityQuery.error}
            inactiveCount={activityCounts.inactive}
            isError={activityQuery.isError}
            isFetching={activityQuery.isFetching && !activityQuery.isPending}
            isPending={activityQuery.isPending}
            items={activityItems}
            onDelete={handleDeleteActivity}
            onEdit={handleEditActivity}
          />
        )}
      </div>
      <SalesActivityFormDialog
        activity={editingActivity}
        isPending={activityPending}
        onOpenChange={handleActivityFormOpenChange}
        onSubmit={handleActivitySubmit}
        open={activityFormOpen}
      />
      <SalesActivityOutcomeFormDialog
        isPending={outcomePending}
        onOpenChange={handleOutcomeFormOpenChange}
        onSubmit={handleOutcomeSubmit}
        open={outcomeFormOpen}
        outcome={editingOutcome}
        statusOptions={statusLookupQuery.data ?? []}
      />
      <SalesActivityDeleteDialog
        isPending={
          catalog === 'outcome'
            ? patchOutcomeMutation.isPending
            : patchActivityMutation.isPending
        }
        name={deletingName}
        onConfirm={
          catalog === 'outcome'
            ? handleOutcomeDeleteConfirm
            : handleActivityDeleteConfirm
        }
        onOpenChange={
          catalog === 'outcome'
            ? handleOutcomeDeleteOpenChange
            : handleActivityDeleteOpenChange
        }
        open={
          catalog === 'outcome'
            ? deletingOutcome != null
            : deletingActivity != null
        }
        title={
          catalog === 'outcome' ? DELETE_OUTCOME_TITLE : DELETE_ACTIVITY_TITLE
        }
      />
    </section>
  );
};
