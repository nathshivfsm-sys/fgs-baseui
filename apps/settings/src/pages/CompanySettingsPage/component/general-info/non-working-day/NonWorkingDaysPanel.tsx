import { useId } from 'react';
import type { NonWorkingDaysPanelProps } from '../../../types';
import { NonWorkingDayDeleteDialog } from './NonWorkingDayDeleteDialog';
import { NonWorkingDayFormDialog } from './NonWorkingDayFormDialog';
import { NonWorkingDaysHeader } from './NonWorkingDaysHeader';
import { NonWorkingDaysPager } from './NonWorkingDaysPager';
import { NonWorkingDaysStatus } from './NonWorkingDaysStatus';
import { NonWorkingDaysTable } from './NonWorkingDaysTable';
import { useNonWorkingDaysPanel } from './use-non-working-days-panel';

export const NonWorkingDaysPanel = ({
  queryClient,
}: NonWorkingDaysPanelProps) => {
  const titleId = useId();
  const {
    deletingRow,
    editingRow,
    formOpen,
    handleDeleteConfirm,
    handleDeleteOpenChange,
    handleFormOpenChange,
    handleFormSubmit,
    handleNextPage,
    handlePreviousPage,
    isDeletePending,
    items,
    openCreate,
    openEdit,
    page,
    pageCount,
    queryError,
    queryPending,
    saveMessage,
    setDeletingRow,
    writeError,
    writePending,
  } = useNonWorkingDaysPanel(queryClient);

  return (
    <section aria-labelledby={titleId} className="min-w-0 space-y-4">
      <NonWorkingDaysHeader onAdd={openCreate} titleId={titleId} />
      <NonWorkingDaysStatus
        queryError={queryError}
        saveMessage={saveMessage}
        writeError={writeError}
      />
      {queryError ? null : (
        <>
          <NonWorkingDaysTable
            isPending={queryPending}
            items={items}
            onDelete={setDeletingRow}
            onEdit={openEdit}
          />
          <NonWorkingDaysPager
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            page={page}
            pageCount={pageCount}
          />
        </>
      )}
      <NonWorkingDayFormDialog
        isPending={writePending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        row={editingRow}
      />
      <NonWorkingDayDeleteDialog
        isPending={isDeletePending}
        onConfirm={handleDeleteConfirm}
        onOpenChange={handleDeleteOpenChange}
        open={deletingRow != null}
        row={deletingRow}
      />
    </section>
  );
};
