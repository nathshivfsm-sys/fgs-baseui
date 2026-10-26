import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createCustomerMutationOptions,
  toCustomerCreateDto,
  type CustomerCreateForm,
} from '@cms/customer-data-access';
import {
  CREATE_CUSTOMER_FORM_ID,
  CREATE_ERROR_TITLE,
  CREATE_SUCCESS_DESCRIPTION,
  CREATE_SUCCESS_TITLE,
  CreateCustomerForm,
} from '@cms/customer-ui';
import { alert } from '@cms/ui';
import { CUSTOMERS_LIST_PATH, customerDetailPath } from './constant';
import {
  CreateCustomerFormFooter,
  CreateCustomerHeader,
  DiscardChangesDialog,
} from './component';
import type { CreateCustomerPageProps } from './types';
import { describeCreateCustomerError, useUnsavedChangesGuard } from './util';

export const CreateCustomerPage = ({
  queryClient,
}: CreateCustomerPageProps) => {
  const navigate = useNavigate();
  const [discardOpen, setDiscardOpen] = useState(false);
  const skipGuardRef = useRef(false);
  const [creationOption, setCreationOption] = useState<
    CustomerCreateForm['creationOption']
  >('billToAndServiceLocation');
  const [isDirty, setIsDirty] = useState(false);

  const createCustomerMutation = useMutation(
    createCustomerMutationOptions(queryClient),
    queryClient,
  );

  useUnsavedChangesGuard(
    isDirty && !createCustomerMutation.isPending && !skipGuardRef.current,
  );

  const navigateAway = () => {
    navigate(CUSTOMERS_LIST_PATH);
  };

  const handleBack = () => {
    if (isDirty && !skipGuardRef.current) {
      setDiscardOpen(true);
      return;
    }
    navigateAway();
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleDiscardConfirm = () => {
    skipGuardRef.current = true;
    navigateAway();
  };

  const handleDiscardOpenChange = (open: boolean) => {
    setDiscardOpen(open);
  };

  const handleCreationOptionChange = useCallback(
    (option: CustomerCreateForm['creationOption']) => {
      setCreationOption(option);
    },
    [],
  );

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const handleSubmit = async (values: CustomerCreateForm) => {
    try {
      const result = await createCustomerMutation.mutateAsync(
        toCustomerCreateDto(values),
      );
      skipGuardRef.current = true;
      alert.success(CREATE_SUCCESS_TITLE, {
        description: CREATE_SUCCESS_DESCRIPTION,
      });
      navigate(customerDetailPath(result.customer.id));
    } catch (error) {
      alert.error(CREATE_ERROR_TITLE, {
        description: describeCreateCustomerError(error),
      });
    }
  };

  return (
    <section className="flex flex-col pb-3" data-testid="create-customer-page">
      <div className="px-8 pt-5">
        <CreateCustomerHeader
          creationOption={creationOption}
          onBack={handleBack}
        />
      </div>
      <div className="px-8 pb-5 pt-4">
        <CreateCustomerForm
          onCreationOptionChange={handleCreationOptionChange}
          onDirtyChange={handleDirtyChange}
          onSubmit={handleSubmit}
          queryClient={queryClient}
        />
      </div>
      <CreateCustomerFormFooter
        creationOption={creationOption}
        formId={CREATE_CUSTOMER_FORM_ID}
        isPending={createCustomerMutation.isPending}
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
