/**
 * Wire request/response contracts for platform services shared across remotes.
 * Data-access, MSW, and UI all import from here — do not duplicate DTOs.
 */
export {
  apiResponseSchema,
  pagedResultSchema,
  type PagedListParams,
  type PagedResult,
  type SortDirection,
} from './lib/envelope.schema';
export {
  attachmentCreateFieldsSchema,
  attachmentListResponseSchema,
  attachmentMetadataDtoSchema,
  attachmentMetadataResponseSchema,
  type AttachmentByEntityParams,
  type AttachmentCreateDto,
  type AttachmentCreateFields,
  type AttachmentListParams,
  type AttachmentMetadataDto,
} from './lib/attachment.schema';
