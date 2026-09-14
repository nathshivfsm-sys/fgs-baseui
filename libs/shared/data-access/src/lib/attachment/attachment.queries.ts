import { queryOptions } from '@tanstack/react-query';
import type { QueryRequestContext } from '@cms/platform-contract';
import { customFetch } from '@cms/shared-api';
import {
  attachmentListResponseSchema,
  attachmentMetadataResponseSchema,
  type AttachmentListParams,
  type AttachmentMetadataDto,
  type PagedResult,
} from '@cms/shared-contract';
import { toPagedResult } from '../util';
import {
  attachmentDownloadEndpoint,
  attachmentListEndpoint,
  attachmentMetadataEndpoint,
  attachmentThumbnailEndpoint,
} from './attachment.endpoints';
import { attachmentKeys } from './attachment.keys';

export const loadAttachments = async (
  params: AttachmentListParams,
  { signal }: QueryRequestContext,
): Promise<PagedResult<AttachmentMetadataDto>> => {
  const body = await customFetch<unknown>(attachmentListEndpoint(params), {
    signal,
  });
  return toPagedResult(attachmentListResponseSchema.parse(body).data);
};

export const loadAttachmentMetadata = async (
  entityType: string,
  attachmentId: number,
  { signal }: QueryRequestContext,
): Promise<AttachmentMetadataDto> => {
  const body = await customFetch<unknown>(
    attachmentMetadataEndpoint(entityType, attachmentId),
    { signal },
  );
  return attachmentMetadataResponseSchema.parse(body).data;
};

export const loadAttachmentDownload = async (
  entityType: string,
  attachmentId: number,
  { signal }: QueryRequestContext,
): Promise<Blob> => {
  return customFetch<Blob>(
    attachmentDownloadEndpoint(entityType, attachmentId),
    { signal, responseType: 'blob' },
  );
};

export const loadAttachmentThumbnail = async (
  entityType: string,
  attachmentId: number,
  { signal }: QueryRequestContext,
): Promise<Blob> => {
  return customFetch<Blob>(
    attachmentThumbnailEndpoint(entityType, attachmentId),
    { signal, responseType: 'blob' },
  );
};

export const attachmentListQueryOptions = (
  params: AttachmentListParams = {},
) =>
  queryOptions({
    queryKey: attachmentKeys.list(params),
    queryFn: ({ signal }) => loadAttachments(params, { signal }),
    meta: { feature: 'attachment', operation: 'list' },
  });

export const attachmentMetadataQueryOptions = (
  entityType: string,
  attachmentId: number,
) =>
  queryOptions({
    queryKey: attachmentKeys.detail(entityType, attachmentId),
    queryFn: ({ signal }) =>
      loadAttachmentMetadata(entityType, attachmentId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'attachment', operation: 'detail' },
  });

export const attachmentDownloadQueryOptions = (
  entityType: string,
  attachmentId: number,
) =>
  queryOptions({
    queryKey: attachmentKeys.download(entityType, attachmentId),
    queryFn: ({ signal }) =>
      loadAttachmentDownload(entityType, attachmentId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'attachment', operation: 'download' },
  });

export const attachmentThumbnailQueryOptions = (
  entityType: string,
  attachmentId: number,
) =>
  queryOptions({
    queryKey: attachmentKeys.thumbnail(entityType, attachmentId),
    queryFn: ({ signal }) =>
      loadAttachmentThumbnail(entityType, attachmentId, { signal }),
    staleTime: 5 * 60 * 1000,
    meta: { feature: 'attachment', operation: 'thumbnail' },
  });
