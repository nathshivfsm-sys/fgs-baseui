import { z } from 'zod';
import {
  nullableText,
  pagedResultSchema,
  setupResponseSchema,
  type SetupListParams,
} from './envelope.schema';

/**
 * Wire shapes of `/user` from the FGS User Service swagger (`FgsUser*` DTOs).
 */
export const userAuthenticationMethodSchema = z.enum([
  'password',
  'emailOtp',
  'passwordOrEmailOtp',
  'entraIdOnly',
  'passwordWithMfa',
]);

export const userSummaryDtoSchema = z.object({
  id: z.uuid(),
  displayName: nullableText,
  email: nullableText,
  phoneNumber: nullableText,
  roleId: z.number().nullish(),
  roleName: nullableText,
  invitationStatus: nullableText,
  isActive: z.boolean(),
  lastLoginOn: nullableText,
});

export const userDetailDtoSchema = userSummaryDtoSchema.extend({
  hasAcceptedInvitation: z.boolean(),
});

export const userListSummaryDtoSchema = z.object({
  totalUsers: z.number(),
  pendingInvitation: z.number(),
  activeRegistered: z.number(),
  inactive: z.number(),
  admins: z.number(),
});

export const userListResultDtoSchema = pagedResultSchema(userSummaryDtoSchema).extend({
  summary: userListSummaryDtoSchema.nullish(),
});

export const userInviteDtoSchema = z.object({
  displayName: nullableText,
  email: nullableText,
  phoneNumber: nullableText,
  roleIds: z.array(z.number()).nullish(),
  authenticationMethod: userAuthenticationMethodSchema,
});

export const userUpdateDtoSchema = z.object({
  displayName: nullableText,
  phoneNumber: nullableText,
  roleIds: z.array(z.number()).nullish(),
  isActive: z.boolean(),
});

export const userPatchDtoSchema = z.object({
  displayName: nullableText,
  phoneNumber: nullableText,
  roleIds: z.array(z.number()).nullish(),
  isActive: z.boolean().nullish(),
});

export const userListResponseSchema = setupResponseSchema(userListResultDtoSchema);
export const userDetailResponseSchema = setupResponseSchema(userDetailDtoSchema);
export const userCreateResponseSchema = setupResponseSchema(
  z.array(userDetailDtoSchema).nullish(),
);

export type UserSummaryDto = z.infer<typeof userSummaryDtoSchema>;
export type UserDetailDto = z.infer<typeof userDetailDtoSchema>;
export type UserListSummaryDto = z.infer<typeof userListSummaryDtoSchema>;
export type UserListResultDto = z.infer<typeof userListResultDtoSchema>;
export type UserInviteDto = z.infer<typeof userInviteDtoSchema>;
export type UserUpdateDto = z.infer<typeof userUpdateDtoSchema>;
export type UserPatchDto = z.infer<typeof userPatchDtoSchema>;
export type UserAuthenticationMethod = z.infer<
  typeof userAuthenticationMethodSchema
>;

export type UserListParams = SetupListParams & {
  email?: string;
  displayName?: string;
  roleIds?: number[];
  roleId?: number;
  includeSummary?: boolean;
};

export type UserListResult = {
  items: UserSummaryDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  summary?: UserListSummaryDto | null;
};
