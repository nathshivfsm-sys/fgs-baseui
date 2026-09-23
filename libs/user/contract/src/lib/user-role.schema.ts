import { z } from 'zod';
import { setupResponseSchema } from './envelope.schema';

/**
 * Wire shapes of `/userrole` from the FGS User Service swagger (`FgsUserRole*` DTOs).
 */
export const userRoleDetailDtoSchema = z.object({
  id: z.number(),
  userId: z.uuid(),
  fgsRoleId: z.number(),
  createdOn: z.string(),
  createdBy: z.string().nullish(),
});

export const userRoleLookupDtoSchema = z.object({
  id: z.number(),
  userId: z.uuid(),
  fgsRoleId: z.number(),
});

export const userRoleCreateDtoSchema = z.object({
  userId: z.uuid(),
  fgsRoleId: z.number(),
});

export const userRoleSyncDtoSchema = z.object({
  userId: z.uuid(),
  fgsRoleIds: z.array(z.number()).nullish(),
});

export const userRoleUpdateDtoSchema = z.object({
  fgsRoleId: z.number(),
});

export const userRolePatchDtoSchema = z.object({
  fgsRoleId: z.number().nullish(),
});

export const userRoleDetailResponseSchema = setupResponseSchema(
  userRoleDetailDtoSchema,
);
export const userRoleListResponseSchema = setupResponseSchema(
  z.array(userRoleDetailDtoSchema).nullish(),
);
export const userRoleLookupResponseSchema = setupResponseSchema(
  z.array(userRoleLookupDtoSchema).nullish(),
);

export type UserRoleDetailDto = z.infer<typeof userRoleDetailDtoSchema>;
export type UserRoleLookupDto = z.infer<typeof userRoleLookupDtoSchema>;
export type UserRoleCreateDto = z.infer<typeof userRoleCreateDtoSchema>;
export type UserRoleSyncDto = z.infer<typeof userRoleSyncDtoSchema>;
export type UserRoleUpdateDto = z.infer<typeof userRoleUpdateDtoSchema>;
export type UserRolePatchDto = z.infer<typeof userRolePatchDtoSchema>;

export type UserRoleLookupParams = {
  userId?: string;
};
