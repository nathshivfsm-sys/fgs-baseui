import { userAuthenticationMethodSchema } from '@cms/user-contract';
import { z } from 'zod';

export const inviteUserFormSchema = z.object({
  displayName: z.string().trim().min(1, 'User name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phoneNumber: z.string().trim().min(1, 'Phone is required'),
  roleId: z.string().trim().min(1, 'Role is required'),
  authenticationMethod: userAuthenticationMethodSchema,
});

export type InviteUserForm = z.infer<typeof inviteUserFormSchema>;

export const emptyInviteUserForm = (): InviteUserForm => ({
  displayName: '',
  email: '',
  phoneNumber: '',
  roleId: '',
  authenticationMethod: 'password',
});
