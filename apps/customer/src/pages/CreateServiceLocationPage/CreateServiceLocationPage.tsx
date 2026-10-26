import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createServiceLocationMutationOptions,
  customerDetailQueryOptions,
  toServiceLocationCreateDto,
  type ServiceLocationOnlyForm,
} from '@cms/customer-data-access';
import { paymentTermLookupQueryOptions } from '@cms/shared-data-access';
import {
  ArCustomerPanel,
  CREATE_SERVICE_LOCATION_FORM_ID,
  CREATE_SERVICE_LOCATION_ERROR_TITLE,
  CREATE_SERVICE_LOCATION_SUCCESS_DESCRIPTION,
  CREATE_SERVICE_LOCATION_SUCCESS_TITLE,
  CreateServiceLocationForm,
} from '@cms/customer-ui';
import { alert, BodySmall, cn, SectionCard } from '@cms/ui';
import { DiscardChangesDialog } from '../CreateCustomerPage/component';
import { useUnsavedChangesGuard } from '../CreateCustomerPage/util';
import {
  CreateServiceLocationFormFooter,
  CreateServiceLocationHeader,
} from './component';
import { customerDetailPath, serviceLocationCreatePath } from './constant';
import type { CreateServiceLocationPageProps } from './types';
import { describeCreateServiceLocationError } from './util';
import { resolvePaymentTermLabel } from '../CustomerDetailPage/util';

const parseCustomerId = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

export const CreateServiceLocationPage = ({
  queryClient,
}: CreateServiceLocationPageProps) => {
  const navigate = useNavigate();
  const { customerId: customerIdParam } = useParams<{ customerId: string }>();
  const customerId = parseCustomerId(customerIdParam);
  const [discardOpen, setDiscardOpen] = useState(false);
  const skipGuardRef = useRef(false);
  const [isDirty, setIsDirty] = useState(false);

  const customerQuery = useQuery(
    {
      ...customerDetailQueryOptions(customerId ?? 0),
      enabled: customerId != null,
    },
    queryClient,
  );

  const paymentTermsQuery = useQuery(
    paymentTermLookupQueryOptions(true),
    queryClient,
  );

  const createMutation = useMutation(
    createServiceLocationMutationOptions(queryClient, customerId ?? 0),
    queryClient,
  );

  useUnsavedChangesGuard(
    isDirty && !createMutation.isPending && !skipGuardRef.current,
  );

  const paymentTermLabel = useMemo(
    () =>
      resolvePaymentTermLabel(
        customerQuery.data?.defaultPaymentTermId,
        paymentTermsQuery.data,
      ),
    [customerQuery.data?.defaultPaymentTermId, paymentTermsQuery.data],
  );

  const customerErrorMessage = useMemo(() => {
    if (!customerQuery.isError) return null;
    return describeCreateServiceLocationError(customerQuery.error);
  }, [customerQuery.error, customerQuery.isError]);

  const navigateToDetail = () => {
    if (customerId == null) return;
    navigate(customerDetailPath(customerId));
  };

  const handleBack = () => {
    if (isDirty && !skipGuardRef.current) {
      setDiscardOpen(true);
      return;
    }
    navigateToDetail();
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleDiscardConfirm = () => {
    skipGuardRef.current = true;
    navigateToDetail();
  };

  const handleDiscardOpenChange = (open: boolean) => {
    setDiscardOpen(open);
  };

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const handleBillToSelect = (nextCustomerId: number) => {
    if (customerId === nextCustomerId) return;
    navigate(serviceLocationCreatePath(nextCustomerId), { replace: true });
  };

  const handleSubmit = async (values: ServiceLocationOnlyForm) => {
    if (customerId == null) return;
    try {
      await createMutation.mutateAsync(toServiceLocationCreateDto(values));
      skipGuardRef.current = true;
      alert.success(CREATE_SERVICE_LOCATION_SUCCESS_TITLE, {
        description: CREATE_SERVICE_LOCATION_SUCCESS_DESCRIPTION,
      });
      navigate(customerDetailPath(customerId));
    } catch (error) {
      alert.error(CREATE_SERVICE_LOCATION_ERROR_TITLE, {
        description: describeCreateServiceLocationError(error),
      });
    }
  };

  if (customerId == null) {
    return (
      <section
        className="flex flex-col gap-3 px-8 pt-5"
        data-testid="create-service-location-page"
      >
        <BodySmall color="foreground-subtle">
          The customer id in the URL is invalid.
        </BodySmall>
        <Link
          className="text-action underline-offset-2 hover:underline"
          to=".."
        >
          Back to customers
        </Link>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col pb-3"
      data-testid="create-service-location-page"
    >
      <div className="px-8 pt-5">
        <CreateServiceLocationHeader
          customerId={customerId}
          customerName={
            customerQuery.data?.displayName ?? customerQuery.data?.name
          }
          loading={customerQuery.isPending}
          onBack={handleBack}
        />
      </div>
      <div className="px-8 pb-5 pt-4">
        <SectionCard padding="none" radius="panel" tone="soft">
          <div
            className={cn(
              'grid grid-cols-1 divide-border-subtle max-md:divide-y md:grid-cols-2 md:divide-x',
            )}
          >
            <CreateServiceLocationForm
              onDirtyChange={handleDirtyChange}
              onSubmit={handleSubmit}
              queryClient={queryClient}
            />
            <ArCustomerPanel
              customer={customerQuery.data}
              errorMessage={customerErrorMessage}
              loading={customerQuery.isPending}
              onSelectCustomer={handleBillToSelect}
              paymentTermLabel={paymentTermLabel}
              queryClient={queryClient}
            />
          </div>
        </SectionCard>
      </div>
      <CreateServiceLocationFormFooter
        formId={CREATE_SERVICE_LOCATION_FORM_ID}
        isPending={createMutation.isPending}
        onCancel={handleCancel}
      />
      <DiscardChangesDialog
        onConfirmDiscard={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </section>
  );
};
