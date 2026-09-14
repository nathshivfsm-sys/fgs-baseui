import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  attachmentMetadataResponseSchema,
  type AttachmentByEntityParams,
  type AttachmentCreateDto,
  type AttachmentMetadataDto,
} from '@cms/shared-contract';
import {
  attachmentByEntityEndpoint,
  attachmentCollectionEndpoint,
  attachmentDetailEndpoint,
} from './attachment.endpoints';
import { attachmentKeys } from './attachment.keys';

function toAttachmentFormData(body: AttachmentCreateDto): FormData {
  const form = new FormData();
  form.append('file', body.file);
  if (body.entityType != null) form.append('entityType', body.entityType);
  form.append('entityId', String(body.entityId));
  if (body.category != null) form.append('category', body.category);
  if (body.description != null) form.append('description', body.description);
  if (body.tags != null) form.append('tags', body.tags);
  if (body.isVisibleToCustomer != null) {
    form.append('isVisibleToCustomer', String(body.isVisibleToCustomer));
  }
  if (body.isVisibleToFieldTechnician != null) {
    form.append(
      'isVisibleToFieldTechnician',
      String(body.isVisibleToFieldTechnician),
    );
  }
  if (body.logoVariant != null) form.append('logoVariant', body.logoVariant);
  return form;
}

export const createAttachment = async (
  body: AttachmentCreateDto,
  context?: QueryRequestContext,
): Promise<AttachmentMetadataDto> => {
  const response = await customFetch<unknown>(attachmentCollectionEndpoint, {
    method: 'POST',
    body: toAttachmentFormData(body),
    signal: context?.signal,
  });
  return attachmentMetadataResponseSchema.parse(response).data;
};

export const deleteAttachment = async (
  attachmentId: number,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(attachmentDetailEndpoint(attachmentId), {
    method: 'DELETE',
    signal: context?.signal,
  });
};

export const deleteAttachmentsByEntity = async (
  params: AttachmentByEntityParams,
  context?: QueryRequestContext,
): Promise<void> => {
  await customFetch<unknown>(attachmentByEntityEndpoint(params), {
    method: 'DELETE',
    signal: context?.signal,
  });
};

function invalidateAttachments(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: attachmentKeys.all });
}

export const createAttachmentMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (body: AttachmentCreateDto) => createAttachment(body),
    meta: { feature: 'attachment', operation: 'create' },
    onSuccess: () => invalidateAttachments(queryClient),
  });

export const deleteAttachmentMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: (attachmentId: number) => deleteAttachment(attachmentId),
    meta: { feature: 'attachment', operation: 'delete' },
    onSuccess: () => invalidateAttachments(queryClient),
  });

export const deleteAttachmentsByEntityMutationOptions = (
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (params: AttachmentByEntityParams) =>
      deleteAttachmentsByEntity(params),
    meta: { feature: 'attachment', operation: 'delete-by-entity' },
    onSuccess: () => invalidateAttachments(queryClient),
  });
