import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  cloneRoleMutationOptions,
  deleteRoleMutationOptions,
  permissionLookupQueryOptions,
  roleDetailQueryOptions,
  roleListQueryOptions,
  rolePermissionsByRoleQueryOptions,
  syncRolePermissionsMutationOptions,
  userListQueryOptions,
} from '@cms/settings-data-access';
import { alert } from '@cms/ui';
import type { RoleSummaryDto } from '@cms/user-contract';
import {
  CloneRoleDialog,
  RoleDeleteDialog,
  RoleDetailPanel,
  RoleListPanel,
  RolesPermissionsHeader,
} from './component';
import {
  CLONE_SUCCESS_MESSAGE,
  CLONE_SUCCESS_TITLE,
  DELETE_ROLE_BLOCKED_MESSAGE,
  DELETE_ROLE_BLOCKED_TITLE,
  SAVE_SUCCESS_MESSAGE,
  SAVE_SUCCESS_TITLE,
} from './constant';
import type { RoleDetailTab, RolesPermissionsPageProps } from './types';
import {
  buildAllowedPermissionIds,
  buildCopyRoleCode,
  countUsersByRole,
  describeRolesPermissionsError,
  resolvePermissionSourceRoleId,
} from './util';

const toPermissionIdSet = (ids: readonly number[]) => new Set(ids);

const buildRoleById = (roles: readonly RoleSummaryDto[]) => {
  const map = new Map<number, RoleSummaryDto>();
  for (const role of roles) {
    map.set(role.id, role);
  }
  return map;
};

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
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rolePendingDelete, setRolePendingDelete] =
    useState<RoleSummaryDto | null>(null);
  const reservedRoleCodes = useRef(new Set<string>());

  const rolesQuery = useQuery(
    roleListQueryOptions({ page: 1, pageSize: 100, isActive: true }),
    queryClient,
  );
  const permissionCatalogQuery = useQuery(
    permissionLookupQueryOptions(true),
    queryClient,
  );
  const usersQuery = useQuery(
    userListQueryOptions({ page: 1, pageSize: 500 }),
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
  const roleUsersQuery = useQuery(
    {
      ...userListQueryOptions({
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
  const deleteRoleMutation = useMutation(
    deleteRoleMutationOptions(queryClient),
    queryClient,
  );

  const roles = rolesQuery.data?.items ?? [];
  const roleById = useMemo(() => buildRoleById(roles), [roles]);
  const seededRoles = useMemo(
    () => roles.filter((role) => role.isBuiltIn),
    [roles],
  );
  const customRoles = useMemo(
    () => roles.filter((role) => !role.isBuiltIn),
    [roles],
  );

  const userCountByRole = useMemo(
    () => countUsersByRole(usersQuery.data?.items ?? []),
    [usersQuery.data?.items],
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
  const permissionCatalog = permissionCatalogQuery.data ?? [];

  const permissionSourceRoleId = useMemo(
    () => resolvePermissionSourceRoleId(selectedRole, roleById),
    [roleById, selectedRole],
  );

  const sourceRolePermissionsQuery = useQuery(
    {
      ...rolePermissionsByRoleQueryOptions(permissionSourceRoleId ?? 0),
      enabled:
        permissionSourceRoleId != null &&
        selectedRoleId != null &&
        permissionSourceRoleId !== selectedRoleId,
    },
    queryClient,
  );

  const cloneSourcePermissionIds = useMemo(
    () => new Set(savedPermissionIds),
    [savedPermissionIds],
  );

  const ownPermissionIds = useMemo(
    () => rolePermissionsQuery.data?.map((row) => row.fgsPermissionId) ?? [],
    [rolePermissionsQuery.data],
  );

  const hasSourceCeiling =
    permissionSourceRoleId != null && permissionSourceRoleId !== selectedRoleId;

  const allowedPermissionIds = useMemo(
    () =>
      buildAllowedPermissionIds(
        hasSourceCeiling
          ? sourceRolePermissionsQuery.data?.map((row) => row.fgsPermissionId)
          : ownPermissionIds,
      ),
    [hasSourceCeiling, ownPermissionIds, sourceRolePermissionsQuery.data],
  );

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
    if (checked && !allowedPermissionIds.has(permissionId)) return;
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
    const fgsPermissionIds = [...draftPermissionIds].filter((id) =>
      allowedPermissionIds.has(id),
    );
    try {
      await syncPermissionsMutation.mutateAsync({
        fgsRoleId: selectedRoleId,
        fgsPermissionIds,
      });
      setDraftPermissionIds(new Set(fgsPermissionIds));
      setSavedPermissionIds(new Set(fgsPermissionIds));
      alert.success(SAVE_SUCCESS_TITLE, {
        description: SAVE_SUCCESS_MESSAGE,
      });
    } catch (error) {
      alert.error('Save failed', {
        description: describeRolesPermissionsError(error),
      });
    }
  };

  const handleOpenCloneDialog = () => {
    if (!seeded || selectedRole == null) return;
    setCloneDialogOpen(true);
  };

  const handleCloneSubmit = async ({
    name,
    permissionIds,
  }: {
    name: string;
    permissionIds: number[];
  }) => {
    if (selectedRoleId == null || selectedRole == null) return;
    const roleCode = buildCopyRoleCode(selectedRole.roleCode, [
      ...roles.map((role) => role.roleCode),
      ...reservedRoleCodes.current,
    ]);
    reservedRoleCodes.current.add(roleCode);
    let createdRoleId: number | null = null;
    try {
      const cloned = await cloneRoleMutation.mutateAsync({
        id: selectedRoleId,
        body: {
          roleCode,
          name,
          description: selectedRole.description,
          displayOrder: selectedRole.displayOrder,
          parentRoleId: selectedRoleId,
          fgsPermissionIds: permissionIds,
        },
      });
      createdRoleId = cloned.id;
      await syncPermissionsMutation.mutateAsync({
        fgsRoleId: cloned.id,
        fgsPermissionIds: permissionIds,
      });
      setCloneDialogOpen(false);
      setSelectedRoleId(cloned.id);
      alert.success(CLONE_SUCCESS_TITLE, {
        description: CLONE_SUCCESS_MESSAGE,
      });
    } catch (error) {
      if (createdRoleId == null) {
        reservedRoleCodes.current.delete(roleCode);
      }
      alert.error('Clone failed', {
        description: describeRolesPermissionsError(error),
      });
    }
  };

  const openDeleteDialog = (role: RoleSummaryDto) => {
    const assignedCount = userCountByRole.get(role.id) ?? 0;
    if (assignedCount > 0) {
      alert.error(DELETE_ROLE_BLOCKED_TITLE, {
        description: DELETE_ROLE_BLOCKED_MESSAGE,
      });
      return;
    }
    setRolePendingDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFromList = (roleId: number) => {
    const role = roleById.get(roleId);
    if (!role || role.isBuiltIn) return;
    openDeleteDialog(role);
  };

  const handleDeleteFromDetail = () => {
    if (selectedRoleId == null) return;
    const role = roleById.get(selectedRoleId);
    if (!role || role.isBuiltIn) return;
    openDeleteDialog(role);
  };

  const handleConfirmDelete = async () => {
    if (rolePendingDelete == null) return;
    try {
      await deleteRoleMutation.mutateAsync(rolePendingDelete.id);
      setDeleteDialogOpen(false);
      setRolePendingDelete(null);
      if (selectedRoleId === rolePendingDelete.id) {
        setSelectedRoleId(null);
      }
      alert.success('Role deleted', {
        description: 'The custom role was removed.',
      });
    } catch (error) {
      alert.error('Delete failed', {
        description: describeRolesPermissionsError(error),
      });
    }
  };

  const roleName = selectedRole?.name ?? selectedRole?.roleCode ?? null;
  const userCount =
    selectedRoleId != null
      ? (userCountByRole.get(selectedRoleId) ??
        roleUsersQuery.data?.totalCount ??
        0)
      : 0;

  const sourcePermissionsLoading =
    hasSourceCeiling && sourceRolePermissionsQuery.isPending;

  const clonePending =
    cloneRoleMutation.isPending || syncPermissionsMutation.isPending;

  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col gap-4"
      data-testid="roles-permissions-page"
    >
      <RolesPermissionsHeader />

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden">
        <RoleListPanel
          customRoles={customRoles}
          userCountByRole={userCountByRole}
          onDeleteRole={handleDeleteFromList}
          onSelectRole={handleSelectRole}
          selectedRoleId={selectedRoleId}
          seededRoles={seededRoles}
        />
        <RoleDetailPanel
          activeTab={activeTab}
          allowedPermissionIds={allowedPermissionIds}
          canEdit={canEdit}
          dirty={dirty}
          userCount={userCount}
          users={roleUsersQuery.data?.items ?? []}
          usersLoading={roleUsersQuery.isPending}
          onCancel={handleCancel}
          onDeleteRole={handleDeleteFromDetail}
          onOpenCloneDialog={handleOpenCloneDialog}
          onSave={handleSave}
          onTabChange={setActiveTab}
          onTogglePermission={handleTogglePermission}
          permissionCatalog={permissionCatalog}
          permissionCatalogLoading={permissionCatalogQuery.isPending}
          permissionsLoading={
            rolePermissionsQuery.isPending || sourcePermissionsLoading
          }
          roleLoading={roleDetailQuery.isPending && selectedRoleId != null}
          roleName={roleName}
          savePending={syncPermissionsMutation.isPending}
          selectedPermissionIds={draftPermissionIds}
          seeded={seeded}
        />
      </div>

      {selectedRole && seeded ? (
        <CloneRoleDialog
          allowedPermissionIds={cloneSourcePermissionIds}
          catalog={permissionCatalog}
          initialPermissionIds={cloneSourcePermissionIds}
          isPending={clonePending}
          onOpenChange={setCloneDialogOpen}
          onSubmit={handleCloneSubmit}
          open={cloneDialogOpen}
          sourceRole={selectedRole}
        />
      ) : null}

      <RoleDeleteDialog
        isPending={deleteRoleMutation.isPending}
        onConfirm={handleConfirmDelete}
        onOpenChange={setDeleteDialogOpen}
        open={deleteDialogOpen}
        role={rolePendingDelete}
      />
    </section>
  );
};
