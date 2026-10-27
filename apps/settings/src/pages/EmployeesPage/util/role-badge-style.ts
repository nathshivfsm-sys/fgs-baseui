export const isAdminRole = (role: {
  name?: string | null;
  roleCode?: string | null;
}): boolean =>
  /admin/i.test(role.name ?? '') || /admin/i.test(role.roleCode ?? '');
