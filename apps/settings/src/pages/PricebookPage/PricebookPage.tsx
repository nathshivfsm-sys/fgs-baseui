import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { PriceBookSummaryDto } from '@cms/settings-contract';
import {
  jobTypeListQueryOptions,
  patchPriceBookMutationOptions,
  priceBookListQueryOptions,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  PricebookDeactivateDialog,
  PricebookHeader,
  PricebookTablePanel,
} from './component';
import {
  DEACTIVATE_ERROR_TITLE,
  DEACTIVATE_SUCCESS_MESSAGE,
  DEACTIVATE_SUCCESS_TITLE,
  PRICEBOOK_LIST_PAGE_SIZE,
} from './constant';
import type { PricebookPageProps } from './types';
import { countPriceBooks, describePricebookError } from './util';

export const PricebookPage = ({ queryClient }: PricebookPageProps) => {
  const navigate = useNavigate();
  const [deactivating, setDeactivating] = useState<PriceBookSummaryDto | null>(
    null,
  );
  const listQuery = useQuery(
    priceBookListQueryOptions({
      page: 1,
      pageSize: PRICEBOOK_LIST_PAGE_SIZE,
    }),
    queryClient,
  );
  const jobTypesQuery = useQuery(
    jobTypeListQueryOptions({
      page: 1,
      pageSize: PRICEBOOK_LIST_PAGE_SIZE,
    }),
    queryClient,
  );
  const patchMutation = useMutation(
    patchPriceBookMutationOptions(queryClient),
    queryClient,
  );
  const records = listQuery.data?.items ?? [];
  const counts = useMemo(() => countPriceBooks(records), [records]);
  const tableStatus = listQuery.isPending
    ? 'loading'
    : listQuery.isError
      ? 'error'
      : listQuery.isFetching
        ? 'refetching'
        : 'idle';

  const handleAdd = () => {
    navigate('new', { relative: 'path' });
  };

  const handleEdit = (record: PriceBookSummaryDto) => {
    navigate(String(record.id), { relative: 'path' });
  };

  const handleDeactivate = (record: PriceBookSummaryDto) => {
    if (!record.isActive) return;
    setDeactivating(record);
  };

  const handleDeactivateOpenChange = (open: boolean) => {
    if (!open) setDeactivating(null);
  };

  const handleDeactivateConfirm = () => {
    if (!deactivating || patchMutation.isPending) return;
    patchMutation.mutate(
      { id: deactivating.id, body: { isActive: false } },
      {
        onError: (error) => {
          alert.error(DEACTIVATE_ERROR_TITLE, {
            description: describePricebookError(error),
          });
        },
        onSuccess: () => {
          alert.success(DEACTIVATE_SUCCESS_TITLE, {
            description: DEACTIVATE_SUCCESS_MESSAGE,
          });
          setDeactivating(null);
        },
      },
    );
  };

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="pricebook-page"
    >
      <PricebookHeader onAdd={handleAdd} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <PricebookTablePanel
          activeCount={counts.activeCount}
          inactiveCount={counts.inactiveCount}
          jobTypes={jobTypesQuery.data?.items ?? []}
          loadError={
            listQuery.isError
              ? describePricebookError(listQuery.error)
              : undefined
          }
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          rows={records}
          tableStatus={tableStatus}
        />
      </div>
      <PricebookDeactivateDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivating != null}
        priceBook={deactivating}
      />
    </section>
  );
};
