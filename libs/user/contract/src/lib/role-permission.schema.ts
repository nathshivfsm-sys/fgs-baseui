import { z } from 'zod';
import { setupResponseSchema } from './envelope.schema';
import { permissionDetailDtoSchema } from './permission.schema';

/**
 * Wire shapes of `/rolepermission` from the FGS User Service swagger
 * (`FgsRolePermission*` DTOs).
 */
export const rolePermissionDetailDtoSchema = z.object({
  id: z.number(),
  fgsRoleId: z.number(),
  fgsPermissionId: z.number(),
  createdOn: z.string(),
  createdBy: z.string().nullish(),
  permission: permissionDetailDtoSchema.nullish(),
});

export const rolePermissionLookupDtoSchema = z.object({
  id: z.number(),
  fgsRoleId: z.number(),
  fgsPermissionId: z.number(),
});

export const rolePermissionCreateDtoSchema = z.object({
  fgsRoleId: z.number(),
  fgsPermissionId: z.number(),
});

export const rolePermissionSyncDtoSchema = z.object({
  fgsRoleId: z.number(),
  fgsPermissionIds: z.array(z.number()).nullish(),
});

export const rolePermissionUpdateDtoSchema = z.object({
  fgsPermissionId: z.number(),
});

export const rolePermissionPatchDtoSchema = z.object({
  fgsPermissionId: z.number().nullish(),
});

export const rolePermissionDetailResponseSchema = setupResponseSchema(
  rolePermissionDetailDtoSchema,
);
export const rolePermissionListResponseSchema = setupResponseSchema(
  z.array(rolePermissionDetailDtoSchema).nullish(),
);
export const rolePermissionLookupResponseSchema = setupResponseSchema(
  z.array(rolePermissionLookupDtoSchema).nullish(),
);

export type RolePermissionDetailDto = z.infer<
  typeof rolePermissionDetailDtoSchema
>;
export type RolePermissionLookupDto = z.infer<
  typeof rolePermissionLookupDtoSchema
>;
export type RolePermissionCreateDto = z.infer<
  typeof rolePermissionCreateDtoSchema
>;
export type RolePermissionSyncDto = z.infer<typeof rolePermissionSyncDtoSchema>;
export type RolePermissionUpdateDto = z.infer<
  typeof rolePermissionUpdateDtoSchema
>;
export type RolePermissionPatchDto = z.infer<
  typeof rolePermissionPatchDtoSchema
>;

export type RolePermissionLookupParams = {
  fgsRoleId?: number;
};
