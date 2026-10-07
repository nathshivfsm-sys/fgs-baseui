import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createAttachmentMutationOptions } from '@cms/shared-data-access';
import {
  createEmployeeMutationOptions,
  patchEmployeeMutationOptions,
  toEmployeeCreateDto,
  type EmployeeCreateForm,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import { describeEmployeeError } from '../EmployeesPage/util';
import {
  AddEmployeeForm,
  AddEmployeeFormFooter,
  AddEmployeeHeader,
} from './component';
import {
  ADD_EMPLOYEE_FORM_ID,
  EMPLOYEES_LIST_PATH,
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_MESSAGE,
  SAVE_SUCCESS_TITLE,
} from './constant';
import type { AddEmployeePageProps } from './types';

export const AddEmployeePage = ({ queryClient }: AddEmployeePageProps) => {
  const navigate = useNavigate();

  const createEmployeeMutation = useMutation(
    createEmployeeMutationOptions(queryClient),
    queryClient,
  );
  const patchEmployeeMutation = useMutation(
    patchEmployeeMutationOptions(queryClient),
    queryClient,
  );
  const createAttachmentMutation = useMutation(
    createAttachmentMutationOptions(queryClient),
    queryClient,
  );

  const isPending =
    createEmployeeMutation.isPending ||
    patchEmployeeMutation.isPending ||
    createAttachmentMutation.isPending;

  const handleCancel = () => {
    navigate(EMPLOYEES_LIST_PATH);
  };

  const handleSubmit = async (
    values: EmployeeCreateForm,
    profilePhotoFile: File | null,
  ) => {
    try {
      const created = await createEmployeeMutation.mutateAsync(
        toEmployeeCreateDto(values),
      );

      if (profilePhotoFile) {
        const attachment = await createAttachmentMutation.mutateAsync({
          file: profilePhotoFile,
          entityType: 'Employee',
          entityId: created.id,
          category: 'profilePhoto',
        });
        await patchEmployeeMutation.mutateAsync({
          id: created.id,
          body: { profilePhotoFileId: attachment.attachmentId },
        });
      }

      alert.success(SAVE_SUCCESS_TITLE, {
        description: SAVE_SUCCESS_MESSAGE,
      });
      navigate(EMPLOYEES_LIST_PATH);
    } catch (error) {
      alert.error(SAVE_ERROR_TITLE, {
        description: describeEmployeeError(error),
      });
    }
  };

  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      data-testid="add-employee-page"
    >
      <div className="shrink-0 px-8 pt-5">
        <AddEmployeeHeader />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 pb-5 pt-4">
        <AddEmployeeForm onSubmit={handleSubmit} queryClient={queryClient} />
      </div>
      <AddEmployeeFormFooter
        formId={ADD_EMPLOYEE_FORM_ID}
        isPending={isPending}
        onCancel={handleCancel}
      />
    </section>
  );
};
