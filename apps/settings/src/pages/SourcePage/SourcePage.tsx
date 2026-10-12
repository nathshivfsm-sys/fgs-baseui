import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { SourceDetailDto, SourceSummaryDto } from '@cms/settings-contract';
import {
  createSourceMutationOptions,
  patchSourceMutationOptions,
  sourceListQueryOptions,
  toSourceCreateDto,
  toSourceUpdateDto,
  updateSourceMutationOptions,
  type SourceForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  SourceDeactivateDialog,
  SourceFormDialog,
  SourceHeader,
  SourceTablePanel,
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
import type { SourcePageProps } from './types';
import { describeSourceError } from './util';

export const SourcePage = ({ queryClient }: SourcePageProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SourceSummaryDto | null>(
    null,
  );
  const [deactivatingRecord, setDeactivatingRecord] =
    useState<SourceSummaryDto | null>(null);

  const activeCountQuery = useQuery(
    sourceListQueryOptions({ page: 1, pageSize: 1, isActive: true }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    sourceListQueryOptions({ page: 1, pageSize: 1, isActive: false }),
    queryClient,
  );
  const createMutation = useMutation(
    createSourceMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateSourceMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchSourceMutationOptions(queryClient),
    queryClient,
  );

  const formPending = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: SourceSummaryDto) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDeactivate = (record: SourceSummaryDto) => {
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

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeSourceError(error),
    });
  };

  const syncActiveStatus = (
    record: SourceDetailDto,
    isActive: boolean,
    onDone: () => void,
  ) => {
    if (record.isActive === isActive) {
      onDone();
      return;
    }
    patchMutation.mutate(
      { id: record.id, body: { isActive } },
      {
        onError: handleWriteError,
        onSuccess: onDone,
      },
    );
  };

  const handleFormSubmit = (values: SourceForm) => {
    if (formPending || patchMutation.isPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toSourceUpdateDto(values, editingRecord),
        },
        {
          onError: handleWriteError,
          onSuccess: (updated) => {
            syncActiveStatus(updated, values.isActive, () => {
              alert.success(UPDATE_SUCCESS_TITLE, {
                description: UPDATE_SUCCESS_MESSAGE,
              });
              setFormOpen(false);
              setEditingRecord(null);
            });
          },
        },
      );
      return;
    }
    createMutation.mutate(toSourceCreateDto(values), {
      onError: handleWriteError,
      onSuccess: (created) => {
        syncActiveStatus(created, values.isActive, () => {
          alert.success(CREATE_SUCCESS_TITLE, {
            description: CREATE_SUCCESS_MESSAGE,
          });
          setFormOpen(false);
        });
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
            description: describeSourceError(error),
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
      data-testid="source-page"
    >
      <SourceHeader onAdd={handleAdd} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <SourceTablePanel
          activeCount={activeCountQuery.data?.totalCount ?? 0}
          inactiveCount={inactiveCountQuery.data?.totalCount ?? 0}
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          queryClient={queryClient}
        />
      </div>
      <SourceFormDialog
        isPending={formPending || patchMutation.isPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        source={editingRecord}
      />
      <SourceDeactivateDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivatingRecord != null}
        source={deactivatingRecord}
      />
    </section>
  );
};
