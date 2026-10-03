import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TimeslotSummaryDto } from '@cms/settings-contract';
import {
  createTimeslotMutationOptions,
  patchTimeslotMutationOptions,
  timeslotListQueryOptions,
  toTimeslotCreateDto,
  toTimeslotUpdateDto,
  updateTimeslotMutationOptions,
  zoneLookupQueryOptions,
  type TimeslotForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  TimeslotDeactivateDialog,
  TimeslotFormDialog,
  TimeslotHeader,
  TimeslotTablePanel,
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
import type { TimeslotListFilters, TimeslotPageProps } from './types';
import { emptyTimeslotListFilters } from './types';
import { describeTimeslotError } from './util';

export const TimeslotPage = ({ queryClient }: TimeslotPageProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TimeslotSummaryDto | null>(
    null,
  );
  const [deactivatingRecord, setDeactivatingRecord] =
    useState<TimeslotSummaryDto | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<TimeslotListFilters>(
    emptyTimeslotListFilters(),
  );

  const activeCountQuery = useQuery(
    timeslotListQueryOptions({ page: 1, pageSize: 1, isActive: true }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    timeslotListQueryOptions({ page: 1, pageSize: 1, isActive: false }),
    queryClient,
  );
  const zoneLookupQuery = useQuery(zoneLookupQueryOptions(true), queryClient);
  const createMutation = useMutation(
    createTimeslotMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateTimeslotMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchTimeslotMutationOptions(queryClient),
    queryClient,
  );

  const zoneOptions = useMemo(
    () =>
      (zoneLookupQuery.data ?? [])
        .filter((zone) => zone.name)
        .map((zone) => ({
          value: String(zone.id),
          label: zone.name ?? '',
        })),
    [zoneLookupQuery.data],
  );
  const formPending = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: TimeslotSummaryDto) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDeactivate = (record: TimeslotSummaryDto) => {
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

  const handleFiltersApply = (filters: TimeslotListFilters) => {
    setAppliedFilters(filters);
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyTimeslotListFilters());
  };

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeTimeslotError(error),
    });
  };

  const handleFormSubmit = (values: TimeslotForm) => {
    if (formPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toTimeslotUpdateDto(values, editingRecord),
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
    createMutation.mutate(toTimeslotCreateDto(values), {
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
            description: describeTimeslotError(error),
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
      data-testid="timeslot-page"
    >
      <TimeslotHeader onAdd={handleAdd} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <TimeslotTablePanel
          activeCount={activeCountQuery.data?.totalCount ?? 0}
          appliedFilters={appliedFilters}
          inactiveCount={inactiveCountQuery.data?.totalCount ?? 0}
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          onFiltersApply={handleFiltersApply}
          onFiltersClear={handleFiltersClear}
          queryClient={queryClient}
          zoneOptions={zoneOptions}
        />
      </div>
      <TimeslotFormDialog
        isPending={formPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        timeslot={editingRecord}
        zoneOptions={zoneOptions}
      />
      <TimeslotDeactivateDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivatingRecord != null}
        timeslot={deactivatingRecord}
      />
    </section>
  );
};
