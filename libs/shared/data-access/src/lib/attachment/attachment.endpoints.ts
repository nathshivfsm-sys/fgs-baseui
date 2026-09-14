import type {
  AttachmentByEntityParams,
  AttachmentListParams,
} from '@cms/shared-contract';
import { toSearchParams } from '../util';

/** Relative to `customFetch`'s `baseUrl`, which already carries `/api/v1`. */
export const attachmentCollectionEndpoint = '/attachment';

export function attachmentListEndpoint(
  params: AttachmentListParams = {},
): string {
  return `${attachmentCollectionEndpoint}${toSearchParams(params)}`;
}

export function attachmentMetadataEndpoint(
  entityType: string,
  attachmentId: number,
): string {
  return `${attachmentCollectionEndpoint}/${entityType}/${attachmentId}/metadata`;
}

export function attachmentDownloadEndpoint(
  entityType: string,
  attachmentId: number,
): string {
  return `${attachmentCollectionEndpoint}/${entityType}/${attachmentId}`;
}

export function attachmentThumbnailEndpoint(
  entityType: string,
  attachmentId: number,
): string {
  return `${attachmentCollectionEndpoint}/${entityType}/${attachmentId}/thumbnail`;
}

export function attachmentDetailEndpoint(attachmentId: number): string {
  return `${attachmentCollectionEndpoint}/${attachmentId}`;
}

export function attachmentByEntityEndpoint(
  params: AttachmentByEntityParams = {},
): string {
  return `${attachmentCollectionEndpoint}/by-entity${toSearchParams(params)}`;
}
