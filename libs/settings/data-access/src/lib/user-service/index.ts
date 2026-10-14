/**
 * User Service query/mutation factories for Setup screens hosted in the settings
 * MFE (Users, Employees, Roles & Permissions). Wire types stay in `@cms/user-contract`.
 */
export {
  cloneRoleMutationOptions,
  createUsersMutationOptions,
  patchUserMutationOptions,
  permissionLookupQueryOptions,
  roleDetailQueryOptions,
  roleListQueryOptions,
  roleLookupQueryOptions,
  rolePermissionsByRoleQueryOptions,
  syncRolePermissionsMutationOptions,
  updateUserMutationOptions,
  userListQueryOptions,
} from '@cms/user-data-access';

export type { UserListParams } from '@cms/user-contract';
