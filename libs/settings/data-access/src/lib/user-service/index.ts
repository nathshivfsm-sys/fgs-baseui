/**
 * User Service query/mutation factories for Setup screens hosted in the settings
 * MFE (Users, Employees role filter). Wire types stay in `@cms/user-contract`.
 */
export {
  createUsersMutationOptions,
  patchUserMutationOptions,
  roleLookupQueryOptions,
  updateUserMutationOptions,
  userListQueryOptions,
} from '@cms/user-data-access';

export type { UserListParams } from '@cms/user-contract';
