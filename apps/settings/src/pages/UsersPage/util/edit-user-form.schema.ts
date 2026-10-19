import type { UserSummaryDto } from '@cms/user-contract';
import { phoneDigitsOnly } from '@cms/ui';
import { requiredPhoneNumberSchema } from '../../../shared/util';
import { z } from 'zod';

export const editUserFormSchema = z.object({
  displayName: z.string().trim().min(1, 'User name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phoneNumber: requiredPhoneNumberSchema,
  roleId: z.string().trim().min(1, 'Role is required'),
});

export type EditUserForm = z.infer<typeof editUserFormSchema>;

export const emptyEditUserForm = (): EditUserForm => ({
  displayName: '',
  email: '',
  phoneNumber: '',
  roleId: '',
});

export const toEditUserForm = (user: UserSummaryDto): EditUserForm => ({
  displayName: user.displayName?.trim() ?? '',
  email: user.email?.trim() ?? '',
  phoneNumber: phoneDigitsOnly(user.phoneNumber ?? ''),
  roleId: user.roleId != null ? String(user.roleId) : '',
});
