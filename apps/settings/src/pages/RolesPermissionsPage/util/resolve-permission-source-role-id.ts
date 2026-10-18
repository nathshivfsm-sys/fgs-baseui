type RoleHierarchyNode = {
  id: number;
  isBuiltIn: boolean;
  parentRoleId?: number | null;
};

export const resolvePermissionSourceRoleId = (
  role: RoleHierarchyNode | undefined,
  roleById: ReadonlyMap<number, RoleHierarchyNode>,
): number | null => {
  if (!role) return null;
  if (role.isBuiltIn) return role.id;

  let current: number | null | undefined = role.parentRoleId ?? null;
  const visited = new Set<number>();

  while (current != null) {
    if (visited.has(current)) break;
    visited.add(current);
    const parent = roleById.get(current);
    if (!parent) return role.parentRoleId ?? null;
    if (parent.isBuiltIn) return parent.id;
    current = parent.parentRoleId ?? null;
  }

  return role.parentRoleId ?? null;
};
