import type { AttachmentListParams } from '@cms/shared-contract';

export const attachmentKeys = {
  all: ['attachment'] as const,
  lists: () => [...attachmentKeys.all, 'list'] as const,
  list: (params: AttachmentListParams = {}) =>
    [...attachmentKeys.lists(), params] as const,
  details: () => [...attachmentKeys.all, 'detail'] as const,
  detail: (entityType: string, attachmentId: number) =>
    [...attachmentKeys.details(), entityType, attachmentId] as const,
  downloads: () => [...attachmentKeys.all, 'download'] as const,
  download: (entityType: string, attachmentId: number) =>
    [...attachmentKeys.downloads(), entityType, attachmentId] as const,
  thumbnails: () => [...attachmentKeys.all, 'thumbnail'] as const,
  thumbnail: (entityType: string, attachmentId: number) =>
    [...attachmentKeys.thumbnails(), entityType, attachmentId] as const,
} as const;
