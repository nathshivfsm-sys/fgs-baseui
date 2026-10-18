import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useBlocker } from 'react-router-dom';
import {
  glBreakLookupQueryOptions,
  toWorkOrderBookingConfigUpdateDto,
  toWorkOrderBookingFormMeta,
  toWorkOrderBookingFormValues,
  updateWorkOrderBookingConfigMutationOptions,
  workOrderBookingConfigQueryOptions,
  type WorkOrderBookingFormValues,
} from '@cms/settings-data-access';
import { alert, Callout, Skeleton } from '@cms/ui';
import {
  WorkOrderBookingConfigurationForm,
  WorkOrderBookingDiscardDialog,
  WorkOrderBookingHeader,
} from './component';
import {
  BUSINESS_UNIT_BREAK_LEVEL,
  LOAD_ERROR_TITLE,
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_MESSAGE,
  SAVE_SUCCESS_TITLE,
} from './constant';
import type { WorkOrderBookingPageProps } from './types';
import { describeWorkOrderBookingError } from './util';

const FORM_ID = 'work-order-booking-configuration';

export const WorkOrderBookingPage = ({
  queryClient,
}: WorkOrderBookingPageProps) => {
  const [isDirty, setIsDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  const configQuery = useQuery(
    workOrderBookingConfigQueryOptions(),
    queryClient,
  );
  const businessUnitLookupQuery = useQuery(
    glBreakLookupQueryOptions(true),
    queryClient,
  );
  const updateMutation = useMutation(
    updateWorkOrderBookingConfigMutationOptions(queryClient),
    queryClient,
  );

  const formValues = useMemo(
    () =>
      configQuery.data
        ? toWorkOrderBookingFormValues(configQuery.data)
        : undefined,
    [configQuery.data],
  );
  const formMeta = configQuery.data
    ? toWorkOrderBookingFormMeta(configQuery.data)
    : { canEdit: false, isWorkOrderNumberSequenceLocked: false };

  const businessUnitOptions = useMemo(
    () =>
      (businessUnitLookupQuery.data ?? [])
        .filter(
          (unit) => unit.breakLevel === BUSINESS_UNIT_BREAK_LEVEL && unit.code,
        )
        .map((unit) => ({
          value: String(unit.id),
          label: `${unit.code} — ${unit.name ?? unit.code}`,
        })),
    [businessUnitLookupQuery.data],
  );

  const blocker = useBlocker(isDirty && !updateMutation.isPending);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    setDiscardOpen(true);
  }, [blocker.state]);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const handleWriteError = (error: unknown) => {
    alert.error(SAVE_ERROR_TITLE, {
      description: describeWorkOrderBookingError(error),
    });
  };

  const handleValidSubmit = (values: WorkOrderBookingFormValues) => {
    if (!formMeta.canEdit || updateMutation.isPending) return;
    updateMutation.mutate(toWorkOrderBookingConfigUpdateDto(values), {
      onError: handleWriteError,
      onSuccess: () => {
        alert.success(SAVE_SUCCESS_TITLE, {
          description: SAVE_SUCCESS_MESSAGE,
        });
        setIsDirty(false);
      },
    });
  };

  const handleDiscardOpenChange = (open: boolean) => {
    setDiscardOpen(open);
    if (!open && blocker.state === 'blocked') {
      blocker.reset?.();
    }
  };

  const handleDiscardConfirm = () => {
    setDiscardOpen(false);
    setIsDirty(false);
    if (blocker.state === 'blocked') {
      blocker.proceed?.();
    }
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      data-testid="work-order-booking"
    >
      <WorkOrderBookingHeader
        auditUpdatedBy={configQuery.data?.updatedBy}
        auditUpdatedOn={configQuery.data?.updatedOn}
        canEdit={formMeta.canEdit}
        formId={FORM_ID}
        isDirty={isDirty}
        isPending={updateMutation.isPending}
      />

      {configQuery.isPending ? (
        <Skeleton className="min-h-[24rem] flex-1 rounded-panel" />
      ) : configQuery.isError ? (
        <Callout title={LOAD_ERROR_TITLE} variant="error">
          {describeWorkOrderBookingError(configQuery.error)}
        </Callout>
      ) : formValues ? (
        <WorkOrderBookingConfigurationForm
          businessUnitOptions={businessUnitOptions}
          canEdit={formMeta.canEdit}
          formId={FORM_ID}
          isPending={updateMutation.isPending}
          isSequenceLocked={formMeta.isWorkOrderNumberSequenceLocked}
          onDirtyChange={handleDirtyChange}
          onValidSubmit={handleValidSubmit}
          values={formValues}
        />
      ) : null}

      <WorkOrderBookingDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </section>
  );
};
