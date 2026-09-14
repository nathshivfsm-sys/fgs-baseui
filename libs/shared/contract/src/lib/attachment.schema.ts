import { z } from 'zod';
import {
  apiResponseSchema,
  nullableText,
  pagedResultSchema,
  type PagedListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/attachment` from the FGS File Service swagger
 * (`AttachmentMetadataDto` and multipart create fields).
 */
export const attachmentMetadataDtoSchema = z.object({
  attachmentId: z.number(),
  tenantId: z.number(),
  companyId: z.number(),
  entityType: nullableText,
  entityId: z.number(),
  category: nullableText,
  originalFileName: nullableText,
  storedFileName: nullableText,
  contentType: nullableText,
  fileExtension: nullableText,
  fileSizeBytes: z.number(),
  tags: z.array(z.string()).nullish(),
  description: nullableText,
  isVisibleToCustomer: z.boolean(),
  isVisibleToFieldTechnician: z.boolean(),
  uploadedByUserId: z.number().nullish(),
  uploadedByName: nullableText,
  uploadedByType: nullableText,
  createdOn: z.string(),
  createdBy: nullableText,
  updatedOn: z.string().nullish(),
  updatedBy: nullableText,
  uploadedOn: z.string(),
  isActive: z.boolean(),
  downloadUrl: nullableText,
  thumbnailUrl: nullableText,
  metadataUrl: nullableText,
});

export const attachmentCreateFieldsSchema = z.object({
  entityType: nullableText,
  entityId: z.number(),
  category: nullableText,
  description: nullableText,
  tags: nullableText,
  isVisibleToCustomer: z.boolean().nullish(),
  isVisibleToFieldTechnician: z.boolean().nullish(),
  logoVariant: nullableText,
});

export const attachmentListResponseSchema = apiResponseSchema(
  pagedResultSchema(attachmentMetadataDtoSchema),
);
export const attachmentMetadataResponseSchema = apiResponseSchema(
  attachmentMetadataDtoSchema,
);

export type AttachmentMetadataDto = z.infer<typeof attachmentMetadataDtoSchema>;
export type AttachmentCreateFields = z.infer<typeof attachmentCreateFieldsSchema>;
export type AttachmentCreateDto = AttachmentCreateFields & {
  file: Blob;
};

export type AttachmentListParams = PagedListParams & {
  entityType?: string;
  entityId?: number;
  isVisibleToCustomer?: boolean;
  isVisibleToFieldTechnician?: boolean;
  category?: string;
  contentType?: string;
  extension?: string;
  fileName?: string;
  uploadedBy?: string;
  uploadedByUserId?: number;
  tags?: string;
};

export type AttachmentByEntityParams = {
  entityType?: string;
  entityId?: number;
  category?: string;
};
