import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createAttachmentMutationOptions } from '@cms/shared-data-access';
import {
  createEmployeeMutationOptions,
  employeeDetailQueryOptions,
  employeeDetailToForm,
  patchEmployeeMutationOptions,
  toEmployeeCreateDto,
  toEmployeePatchDto,
  type EmployeeCreateForm,
  type EmployeeCreateFormDirtyFields,
} from '@cms/settings-data-access';
import { alert, BodySmall } from '@cms/ui';
import { describeEmployeeError } from '../EmployeesPage/util';
import {
  AddEmployeeForm,
  AddEmployeeFormFooter,
  AddEmployeeHeader,
  EmployeeDiscardDialog,
} from './component';
import {
  ADD_EMPLOYEE_FORM_ID,
  EDIT_PAGE_DESCRIPTION,
  EDIT_PAGE_TITLE,
  LOAD_EMPLOYEE_ERROR_TITLE,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  SAVE_EMPLOYEE_LABEL,
  SAVE_ERROR_TITLE,
  SAVE_SUCCESS_MESSAGE,
  SAVE_SUCCESS_TITLE,
  UPDATE_EMPLOYEE_LABEL,
  UPDATE_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_TITLE,
} from './constant';
import type { AddEmployeePageProps } from './types';

export const AddEmployeePage = ({ queryClient }: AddEmployeePageProps) => {
  const navigate = useNavigate();
  const { employeeId: employeeIdParam } = useParams();
  const employeeId = employeeIdParam ? Number(employeeIdParam) : undefined;
  const isEdit = employeeId != null && Number.isFinite(employeeId);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  const detailQuery = useQuery(
    {
      ...employeeDetailQueryOptions(employeeId ?? 0),
      enabled: isEdit,
    },
    queryClient,
  );

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

  const initialValues = useMemo(
    () =>
      detailQuery.data ? employeeDetailToForm(detailQuery.data) : undefined,
    [detailQuery.data],
  );

  const isPending =
    createEmployeeMutation.isPending ||
    patchEmployeeMutation.isPending ||
    createAttachmentMutation.isPending;

  const handleDirtyChange = (dirty: boolean) => {
    setFormDirty(dirty);
  };

  const handleLeave = () => {
    navigate('..', { relative: 'path' });
  };

  const handleCancel = () => {
    if (formDirty) {
      setDiscardOpen(true);
      return;
    }
    handleLeave();
  };

  const handleDiscardOpenChange = (open: boolean) => {
    setDiscardOpen(open);
  };

  const handleDiscardConfirm = () => {
    setDiscardOpen(false);
    handleLeave();
  };

  const uploadProfilePhoto = async (employeeRecordId: number, file: File) => {
    const attachment = await createAttachmentMutation.mutateAsync({
      file,
      entityType: 'Employee',
      entityId: employeeRecordId,
      category: 'profilePhoto',
    });
    await patchEmployeeMutation.mutateAsync({
      id: employeeRecordId,
      body: { profilePhotoFileId: attachment.attachmentId },
    });
  };

  const handleSubmit = async (
    values: EmployeeCreateForm,
    profilePhotoFile: File | null,
    dirtyFields: EmployeeCreateFormDirtyFields,
  ) => {
    try {
      if (isEdit && employeeId != null) {
        const patch = toEmployeePatchDto(values, dirtyFields);
        if (Object.keys(patch).length > 0) {
          await patchEmployeeMutation.mutateAsync({
            id: employeeId,
            body: patch,
          });
        }
        if (profilePhotoFile) {
          await uploadProfilePhoto(employeeId, profilePhotoFile);
        }
        alert.success(UPDATE_SUCCESS_TITLE, {
          description: UPDATE_SUCCESS_MESSAGE,
        });
        handleLeave();
        return;
      }

      const created = await createEmployeeMutation.mutateAsync(
        toEmployeeCreateDto(values),
      );

      if (profilePhotoFile) {
        await uploadProfilePhoto(created.id, profilePhotoFile);
      }

      alert.success(SAVE_SUCCESS_TITLE, {
        description: SAVE_SUCCESS_MESSAGE,
      });
      handleLeave();
    } catch (error) {
      alert.error(SAVE_ERROR_TITLE, {
        description: describeEmployeeError(error),
      });
    }
  };

  const showForm = !isEdit || initialValues != null;

  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      data-testid={isEdit ? 'edit-employee-page' : 'add-employee-page'}
    >
      <div className="shrink-0 px-8 pt-5">
        <AddEmployeeHeader
          description={isEdit ? EDIT_PAGE_DESCRIPTION : PAGE_DESCRIPTION}
          title={isEdit ? EDIT_PAGE_TITLE : PAGE_TITLE}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-8 pb-5 pt-4">
        {isEdit && detailQuery.isPending ? (
          <BodySmall color="foreground-subtle">Loading employee…</BodySmall>
        ) : null}
        {isEdit && detailQuery.isError ? (
          <BodySmall color="foreground-subtle">
            {LOAD_EMPLOYEE_ERROR_TITLE}.{' '}
            {describeEmployeeError(detailQuery.error)}
          </BodySmall>
        ) : null}
        {showForm ? (
          <AddEmployeeForm
            hasExistingPhoto={detailQuery.data?.profilePhotoFileId != null}
            initialValues={initialValues}
            onDirtyChange={handleDirtyChange}
            onSubmit={handleSubmit}
            queryClient={queryClient}
          />
        ) : null}
      </div>
      {showForm ? (
        <AddEmployeeFormFooter
          formId={ADD_EMPLOYEE_FORM_ID}
          isPending={isPending}
          onCancel={handleCancel}
          saveLabel={isEdit ? UPDATE_EMPLOYEE_LABEL : SAVE_EMPLOYEE_LABEL}
        />
      ) : null}
      <EmployeeDiscardDialog
        onConfirm={handleDiscardConfirm}
        onOpenChange={handleDiscardOpenChange}
        open={discardOpen}
      />
    </section>
  );
};
