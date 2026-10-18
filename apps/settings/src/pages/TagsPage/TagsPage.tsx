import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TagDetailDto, TagSummaryDto } from '@cms/settings-contract';
import {
  createTagMutationOptions,
  patchTagMutationOptions,
  tagListQueryOptions,
  toTagCreateDto,
  toTagUpdateDto,
  updateTagMutationOptions,
  type TagForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  TagDeleteDialog,
  TagEntityRemovalDialog,
  TagFormDialog,
  TagHeader,
  TagTablePanel,
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
import type { TagListFilters, TagsPageProps } from './types';
import { emptyTagListFilters } from './types';
import { describeTagError } from './util';

export const TagsPage = ({ queryClient }: TagsPageProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TagSummaryDto | null>(
    null,
  );
  const [deletingRecord, setDeletingRecord] = useState<TagSummaryDto | null>(
    null,
  );
  const [appliedFilters, setAppliedFilters] = useState<TagListFilters>(
    emptyTagListFilters(),
  );
  const [entityRemovalOpen, setEntityRemovalOpen] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState<TagForm | null>(
    null,
  );

  const activeCountQuery = useQuery(
    tagListQueryOptions({ page: 1, pageSize: 1, isActive: true }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    tagListQueryOptions({ page: 1, pageSize: 1, isActive: false }),
    queryClient,
  );
  const createMutation = useMutation(
    createTagMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updateTagMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchTagMutationOptions(queryClient),
    queryClient,
  );

  const formPending = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: TagSummaryDto) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDelete = (record: TagSummaryDto) => {
    setDeletingRecord(record);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingRecord(null);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingRecord(null);
  };

  const handleFiltersApply = (filters: TagListFilters) => {
    setAppliedFilters(filters);
  };

  const handleFiltersClear = () => {
    setAppliedFilters(emptyTagListFilters());
  };

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeTagError(error),
    });
  };

  const syncActiveStatus = (
    record: TagDetailDto,
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

  const submitFormValues = (values: TagForm) => {
    if (formPending || patchMutation.isPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toTagUpdateDto(values, editingRecord),
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
              setPendingFormValues(null);
            });
          },
        },
      );
      return;
    }
    createMutation.mutate(toTagCreateDto(values), {
      onError: handleWriteError,
      onSuccess: (created) => {
        syncActiveStatus(created, values.isActive, () => {
          alert.success(CREATE_SUCCESS_TITLE, {
            description: CREATE_SUCCESS_MESSAGE,
          });
          setFormOpen(false);
          setPendingFormValues(null);
        });
      },
    });
  };

  const handleFormSubmit = (values: TagForm) => {
    if (editingRecord) {
      const previous = editingRecord.entities ?? [];
      const nextEntity = values.entity.trim();
      const removed = previous.filter(
        (entity) => nextEntity === '' || entity !== nextEntity,
      );
      if (removed.length > 0 && previous.length > 0) {
        setPendingFormValues(values);
        setEntityRemovalOpen(true);
        return;
      }
    }
    submitFormValues(values);
  };

  const handleEntityRemovalConfirm = () => {
    setEntityRemovalOpen(false);
    if (pendingFormValues) {
      submitFormValues(pendingFormValues);
    }
  };

  const handleEntityRemovalOpenChange = (open: boolean) => {
    setEntityRemovalOpen(open);
    if (!open) setPendingFormValues(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingRecord || patchMutation.isPending) return;
    patchMutation.mutate(
      { id: deletingRecord.id, body: { isActive: false } },
      {
        onError: (error) => {
          alert.error(DEACTIVATE_ERROR_TITLE, {
            description: describeTagError(error),
          });
        },
        onSuccess: () => {
          alert.success(DEACTIVATE_SUCCESS_TITLE, {
            description: DEACTIVATE_SUCCESS_MESSAGE,
          });
          setDeletingRecord(null);
        },
      },
    );
  };

  const handleDeleteDeactivate = () => {
    handleDeleteConfirm();
  };

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="tags-page"
    >
      <TagHeader />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <TagTablePanel
          activeCount={activeCountQuery.data?.totalCount ?? 0}
          appliedFilters={appliedFilters}
          inactiveCount={inactiveCountQuery.data?.totalCount ?? 0}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onFiltersApply={handleFiltersApply}
          onFiltersClear={handleFiltersClear}
          queryClient={queryClient}
        />
      </div>
      <TagFormDialog
        isPending={formPending || patchMutation.isPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        tag={editingRecord}
      />
      <TagDeleteDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onDeactivate={handleDeleteDeactivate}
        onOpenChange={handleDeleteOpenChange}
        open={deletingRecord != null}
        tag={deletingRecord}
      />
      <TagEntityRemovalDialog
        onConfirm={handleEntityRemovalConfirm}
        onOpenChange={handleEntityRemovalOpenChange}
        open={entityRemovalOpen}
      />
    </section>
  );
};
