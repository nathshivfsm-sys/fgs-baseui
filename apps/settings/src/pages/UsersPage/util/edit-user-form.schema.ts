import { z } from 'zod';
import type { UserSummaryDto } from '@cms/user-contract';

export const editUserFormSchema = z.object({
  displayName: z.string().trim().min(1, 'User name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phoneNumber: z.string().trim().min(1, 'Phone is required'),
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
  phoneNumber: user.phoneNumber?.trim() ?? '',
  roleId: user.roleId != null ? String(user.roleId) : '',
});
