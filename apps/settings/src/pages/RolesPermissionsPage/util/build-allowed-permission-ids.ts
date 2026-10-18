import type { PermissionLookupDto } from '@cms/user-contract';

export const buildAllowedPermissionIds = ({
  catalog,
  sourcePermissionIds,
  unrestricted,
}: {
  catalog: readonly PermissionLookupDto[];
  sourcePermissionIds: readonly number[] | undefined;
  unrestricted: boolean;
}): Set<number> => {
  if (unrestricted) {
    return new Set(catalog.map((permission) => permission.id));
  }
  return new Set(sourcePermissionIds ?? []);
};
