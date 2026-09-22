export {
  userRoleByUserEndpoint,
  userRoleCollectionEndpoint,
  userRoleItemEndpoint,
  userRoleLookupEndpoint,
} from './user-role.endpoints';
export { userRoleKeys } from './user-role.keys';
export {
  createUserRole,
  createUserRoleMutationOptions,
  patchUserRole,
  patchUserRoleMutationOptions,
  syncUserRoles,
  syncUserRolesMutationOptions,
  updateUserRole,
  updateUserRoleMutationOptions,
} from './user-role.mutations';
export {
  loadUserRole,
  loadUserRoleLookup,
  loadUserRolesByUser,
  userRoleDetailQueryOptions,
  userRoleLookupQueryOptions,
  userRolesByUserQueryOptions,
} from './user-role.queries';
export {
  userRoleCreateDtoSchema,
  userRoleDetailDtoSchema,
  userRoleDetailResponseSchema,
  userRoleListResponseSchema,
  userRoleLookupDtoSchema,
  userRoleLookupResponseSchema,
  userRolePatchDtoSchema,
  userRoleSyncDtoSchema,
  userRoleUpdateDtoSchema,
  type UserRoleCreateDto,
  type UserRoleDetailDto,
  type UserRoleLookupDto,
  type UserRoleLookupParams,
  type UserRolePatchDto,
  type UserRoleSyncDto,
  type UserRoleUpdateDto,
} from '@cms/user-contract';
