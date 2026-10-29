import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { PaymentMethodDetailDto } from '@cms/settings-contract';
import {
  createPaymentMethodMutationOptions,
  patchPaymentMethodMutationOptions,
  paymentMethodListQueryOptions,
  toPaymentMethodCreateDto,
  toPaymentMethodUpdateDto,
  updatePaymentMethodMutationOptions,
  type PaymentMethodForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  PaymentMethodDeactivateDialog,
  PaymentMethodFormDialog,
  PaymentMethodHeader,
  PaymentMethodTablePanel,
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
import type { PaymentMethodPageProps } from './types';
import { describePaymentMethodError } from './util';

export const PaymentMethodPage = ({ queryClient }: PaymentMethodPageProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<PaymentMethodDetailDto | null>(null);
  const [deactivatingRecord, setDeactivatingRecord] =
    useState<PaymentMethodDetailDto | null>(null);

  const activeCountQuery = useQuery(
    paymentMethodListQueryOptions({ page: 1, pageSize: 1, isActive: true }),
    queryClient,
  );
  const inactiveCountQuery = useQuery(
    paymentMethodListQueryOptions({ page: 1, pageSize: 1, isActive: false }),
    queryClient,
  );
  const createMutation = useMutation(
    createPaymentMethodMutationOptions(queryClient),
    queryClient,
  );
  const updateMutation = useMutation(
    updatePaymentMethodMutationOptions(queryClient),
    queryClient,
  );
  const patchMutation = useMutation(
    patchPaymentMethodMutationOptions(queryClient),
    queryClient,
  );

  const formPending = createMutation.isPending || updateMutation.isPending;

  const handleAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: PaymentMethodDetailDto) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleDeactivate = (record: PaymentMethodDetailDto) => {
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
      description: describePaymentMethodError(error),
    });
  };

  const syncActiveStatus = (
    record: PaymentMethodDetailDto,
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

  const handleFormSubmit = (values: PaymentMethodForm) => {
    if (formPending || patchMutation.isPending) return;
    if (editingRecord) {
      updateMutation.mutate(
        {
          id: editingRecord.id,
          body: toPaymentMethodUpdateDto(values, editingRecord),
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
    const nextSortOrder =
      (activeCountQuery.data?.totalCount ?? 0) +
      (inactiveCountQuery.data?.totalCount ?? 0) +
      1;
    createMutation.mutate(toPaymentMethodCreateDto(values, nextSortOrder), {
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
            description: describePaymentMethodError(error),
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
      data-testid="payment-method-page"
    >
      <PaymentMethodHeader onAdd={handleAdd} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <PaymentMethodTablePanel
          activeCount={activeCountQuery.data?.totalCount ?? 0}
          inactiveCount={inactiveCountQuery.data?.totalCount ?? 0}
          onDeactivate={handleDeactivate}
          onEdit={handleEdit}
          queryClient={queryClient}
        />
      </div>
      <PaymentMethodFormDialog
        isPending={formPending || patchMutation.isPending}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        open={formOpen}
        paymentMethod={editingRecord}
      />
      <PaymentMethodDeactivateDialog
        isPending={patchMutation.isPending}
        onConfirm={handleDeactivateConfirm}
        onOpenChange={handleDeactivateOpenChange}
        open={deactivatingRecord != null}
        paymentMethod={deactivatingRecord}
      />
    </section>
  );
};
