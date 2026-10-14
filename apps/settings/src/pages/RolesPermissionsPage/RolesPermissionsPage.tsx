import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  cloneRoleMutationOptions,
  employeeListQueryOptions,
  permissionLookupQueryOptions,
  roleDetailQueryOptions,
  roleListQueryOptions,
  rolePermissionsByRoleQueryOptions,
  syncRolePermissionsMutationOptions,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import {
  RoleDetailPanel,
  RoleListPanel,
  RolesPermissionsHeader,
} from './component';
import {
  CLONE_SUCCESS_MESSAGE,
  CLONE_SUCCESS_TITLE,
  SAVE_SUCCESS_MESSAGE,
  SAVE_SUCCESS_TITLE,
} from './constant';
import type { RoleDetailTab, RolesPermissionsPageProps } from './types';
import { countEmployeesByRole, describeRolesPermissionsError } from './util';

const toPermissionIdSet = (ids: readonly number[]) => new Set(ids);

export const RolesPermissionsPage = ({
  queryClient,
}: RolesPermissionsPageProps) => {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<RoleDetailTab>('back-office');
  const [draftPermissionIds, setDraftPermissionIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [savedPermissionIds, setSavedPermissionIds] = useState<Set<number>>(
    () => new Set(),
  );

  const rolesQuery = useQuery(
    roleListQueryOptions({ page: 1, pageSize: 100, isActive: true }),
    queryClient,
  );
  const permissionCatalogQuery = useQuery(
    permissionLookupQueryOptions(true),
    queryClient,
  );
  const employeesQuery = useQuery(
    employeeListQueryOptions({ page: 1, pageSize: 500 }),
    queryClient,
  );

  const roleDetailQuery = useQuery(
    {
      ...roleDetailQueryOptions(selectedRoleId ?? 0),
      enabled: selectedRoleId != null,
    },
    queryClient,
  );
  const rolePermissionsQuery = useQuery(
    {
      ...rolePermissionsByRoleQueryOptions(selectedRoleId ?? 0),
      enabled: selectedRoleId != null,
    },
    queryClient,
  );
  const roleEmployeesQuery = useQuery(
    {
      ...employeeListQueryOptions({
        page: 1,
        pageSize: 100,
        roleIds: selectedRoleId != null ? [selectedRoleId] : undefined,
      }),
      enabled: selectedRoleId != null,
    },
    queryClient,
  );

  const syncPermissionsMutation = useMutation(
    syncRolePermissionsMutationOptions(queryClient),
    queryClient,
  );
  const cloneRoleMutation = useMutation(
    cloneRoleMutationOptions(queryClient),
    queryClient,
  );

  const roles = rolesQuery.data?.items ?? [];
  const seededRoles = useMemo(
    () => roles.filter((role) => role.isBuiltIn),
    [roles],
  );
  const customRoles = useMemo(
    () => roles.filter((role) => !role.isBuiltIn),
    [roles],
  );

  const employeeCountByRole = useMemo(
    () => countEmployeesByRole(employeesQuery.data?.items ?? []),
    [employeesQuery.data?.items],
  );

  useEffect(() => {
    if (selectedRoleId != null) return;
    const firstRole = seededRoles[0] ?? customRoles[0];
    if (firstRole) setSelectedRoleId(firstRole.id);
  }, [customRoles, seededRoles, selectedRoleId]);

  useEffect(() => {
    const assigned =
      rolePermissionsQuery.data?.map((row) => row.fgsPermissionId) ?? [];
    const next = toPermissionIdSet(assigned);
    setDraftPermissionIds(next);
    setSavedPermissionIds(new Set(next));
  }, [rolePermissionsQuery.data, selectedRoleId]);

  const selectedRole = roleDetailQuery.data;
  const seeded = selectedRole?.isBuiltIn ?? false;
  const canEdit = !seeded;
  const dirty = useMemo(() => {
    if (draftPermissionIds.size !== savedPermissionIds.size) return true;
    for (const id of draftPermissionIds) {
      if (!savedPermissionIds.has(id)) return true;
    }
    return false;
  }, [draftPermissionIds, savedPermissionIds]);

  const handleSelectRole = (roleId: number) => {
    setSelectedRoleId(roleId);
    setActiveTab('back-office');
  };

  const handleTogglePermission = (permissionId: number, checked: boolean) => {
    setDraftPermissionIds((current) => {
      const next = new Set(current);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return next;
    });
  };

  const handleCancel = () => {
    setDraftPermissionIds(new Set(savedPermissionIds));
  };

  const handleSave = async () => {
    if (selectedRoleId == null) return;
    try {
      await syncPermissionsMutation.mutateAsync({
        fgsRoleId: selectedRoleId,
        fgsPermissionIds: [...draftPermissionIds],
      });
      setSavedPermissionIds(new Set(draftPermissionIds));
      alert.success(SAVE_SUCCESS_TITLE, {
        description: SAVE_SUCCESS_MESSAGE,
      });
    } catch (error) {
      alert.error('Save failed', {
        description: describeRolesPermissionsError(error),
      });
    }
  };

  const handleClone = async () => {
    if (selectedRoleId == null || selectedRole == null) return;
    try {
      const cloned = await cloneRoleMutation.mutateAsync({
        id: selectedRoleId,
        body: {
          roleCode: `${selectedRole.roleCode ?? 'ROLE'}-COPY`,
          name: `${selectedRole.name ?? 'Role'} Copy`,
          description: selectedRole.description,
          displayOrder: selectedRole.displayOrder,
          fgsPermissionIds: [...savedPermissionIds],
        },
      });
      setSelectedRoleId(cloned.id);
      alert.success(CLONE_SUCCESS_TITLE, {
        description: CLONE_SUCCESS_MESSAGE,
      });
    } catch (error) {
      alert.error('Clone failed', {
        description: describeRolesPermissionsError(error),
      });
    }
  };

  const roleName = selectedRole?.name ?? selectedRole?.roleCode ?? null;
  const employeeCount =
    selectedRoleId != null
      ? (employeeCountByRole.get(selectedRoleId) ??
        roleEmployeesQuery.data?.totalCount ??
        0)
      : 0;

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4"
      data-testid="roles-permissions-page"
    >
      <RolesPermissionsHeader />

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden">
        <RoleListPanel
          customRoles={customRoles}
          employeeCountByRole={employeeCountByRole}
          onSelectRole={handleSelectRole}
          selectedRoleId={selectedRoleId}
          seededRoles={seededRoles}
        />
        <RoleDetailPanel
          activeTab={activeTab}
          canEdit={canEdit}
          dirty={dirty}
          employeeCount={employeeCount}
          employees={roleEmployeesQuery.data?.items ?? []}
          employeesLoading={roleEmployeesQuery.isPending}
          onCancel={handleCancel}
          onClone={handleClone}
          onSave={handleSave}
          onTabChange={setActiveTab}
          onTogglePermission={handleTogglePermission}
          permissionCatalog={permissionCatalogQuery.data ?? []}
          permissionCatalogLoading={permissionCatalogQuery.isPending}
          permissionsLoading={rolePermissionsQuery.isPending}
          roleLoading={roleDetailQuery.isPending && selectedRoleId != null}
          roleName={roleName}
          savePending={syncPermissionsMutation.isPending}
          selectedPermissionIds={draftPermissionIds}
          seeded={seeded}
        />
      </div>
    </section>
  );
};
