import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/role` from the FGS User Service swagger (`FgsRole*` DTOs).
 */
export const roleSummaryDtoSchema = z.object({
  id: z.number(),
  roleCode: nullableText,
  name: nullableText,
  description: nullableText,
  parentRoleId: z.number().nullish(),
  isBuiltIn: z.boolean(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

export const roleDetailDtoSchema = roleSummaryDtoSchema;

export const roleLookupDtoSchema = z.object({
  id: z.number(),
  roleCode: nullableText,
  name: nullableText,
  isBuiltIn: z.boolean(),
  displayOrder: z.number(),
});

export const roleCreateDtoSchema = z.object({
  roleCode: nullableText,
  name: nullableText,
  description: nullableText,
  parentRoleId: z.number().nullish(),
  displayOrder: z.number(),
});

export const roleUpdateDtoSchema = z.object({
  roleCode: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number(),
});

export const rolePatchDtoSchema = z.object({
  roleCode: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  isActive: z.boolean().nullish(),
});

export const roleCloneDtoSchema = z.object({
  roleCode: nullableText,
  name: nullableText,
  description: nullableText,
  displayOrder: z.number().nullish(),
  fgsPermissionIds: z.array(z.number()).nullish(),
});

export const roleListResponseSchema = setupResponseSchema(
  pagedResultSchema(roleSummaryDtoSchema),
);
export const roleDetailResponseSchema = setupResponseSchema(roleDetailDtoSchema);
export const roleLookupResponseSchema = setupResponseSchema(
  z.array(roleLookupDtoSchema),
);

export type RoleSummaryDto = z.infer<typeof roleSummaryDtoSchema>;
export type RoleDetailDto = z.infer<typeof roleDetailDtoSchema>;
export type RoleLookupDto = z.infer<typeof roleLookupDtoSchema>;
export type RoleCreateDto = z.infer<typeof roleCreateDtoSchema>;
export type RoleUpdateDto = z.infer<typeof roleUpdateDtoSchema>;
export type RolePatchDto = z.infer<typeof rolePatchDtoSchema>;
export type RoleCloneDto = z.infer<typeof roleCloneDtoSchema>;

export type RoleListParams = SetupListParams & {
  roleCode?: string;
  name?: string;
  isBuiltIn?: boolean;
};
