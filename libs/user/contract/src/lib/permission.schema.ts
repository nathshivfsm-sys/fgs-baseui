import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/permission` from the FGS User Service swagger (`FgsPermission*` DTOs).
 */
export const permissionSummaryDtoSchema = z.object({
  id: z.number(),
  permissionCode: nullableText,
  module: nullableText,
  resource: nullableText,
  action: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number(),
  isActive: z.boolean(),
});

export const permissionDetailDtoSchema = permissionSummaryDtoSchema;

export const permissionLookupDtoSchema = z.object({
  id: z.number(),
  permissionCode: nullableText,
  module: nullableText,
  resource: nullableText,
  action: nullableText,
  name: nullableText,
  displayOrder: z.number(),
});

export const permissionCreateDtoSchema = z.object({
  permissionCode: nullableText,
  module: nullableText,
  resource: nullableText,
  action: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
});

export const permissionUpdateDtoSchema = z.object({
  permissionCode: nullableText,
  module: nullableText,
  resource: nullableText,
  action: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number(),
});

export const permissionPatchDtoSchema = z.object({
  permissionCode: nullableText,
  module: nullableText,
  resource: nullableText,
  action: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const permissionListResponseSchema = setupResponseSchema(
  pagedResultSchema(permissionSummaryDtoSchema),
);
export const permissionDetailResponseSchema = setupResponseSchema(
  permissionDetailDtoSchema,
);
export const permissionLookupResponseSchema = setupResponseSchema(
  z.array(permissionLookupDtoSchema).nullish(),
);

export type PermissionSummaryDto = z.infer<typeof permissionSummaryDtoSchema>;
export type PermissionDetailDto = z.infer<typeof permissionDetailDtoSchema>;
export type PermissionLookupDto = z.infer<typeof permissionLookupDtoSchema>;
export type PermissionCreateDto = z.infer<typeof permissionCreateDtoSchema>;
export type PermissionUpdateDto = z.infer<typeof permissionUpdateDtoSchema>;
export type PermissionPatchDto = z.infer<typeof permissionPatchDtoSchema>;

export type PermissionListParams = SetupListParams & {
  permissionCode?: string;
  module?: string;
  resource?: string;
  action?: string;
};
