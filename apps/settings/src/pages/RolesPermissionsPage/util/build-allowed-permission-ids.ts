export const buildAllowedPermissionIds = (
  sourcePermissionIds: readonly number[] | undefined,
): Set<number> => new Set(sourcePermissionIds ?? []);
