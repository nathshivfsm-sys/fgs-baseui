import type { PermissionLookupDto } from '@cms/user-contract';

export type FeaturePermissionRow = {
  key: string;
  label: string;
  viewPermissionId?: number;
  createEditPermissionId?: number;
};

export type MobilePermissionGroup = {
  group: string;
  items: PermissionLookupDto[];
};

const normalizeModule = (module: string | null | undefined) =>
  (module ?? '').trim().toLowerCase();

export const isMobilePermission = (permission: PermissionLookupDto) =>
  normalizeModule(permission.module) === 'mobile';

export const isSettingsPermission = (permission: PermissionLookupDto) =>
  normalizeModule(permission.module) === 'settings';

export const isBackOfficeFeaturePermission = (
  permission: PermissionLookupDto,
) => !isMobilePermission(permission) && !isSettingsPermission(permission);

const isViewAction = (action: string | null | undefined) => {
  const value = (action ?? '').toLowerCase();
  return value === 'read' || value === 'view';
};

const isCreateEditAction = (action: string | null | undefined) => {
  const value = (action ?? '').toLowerCase();
  return value === 'write' || value === 'create' || value === 'edit';
};

export const buildFeaturePermissionRows = (
  permissions: readonly PermissionLookupDto[],
): FeaturePermissionRow[] => {
  const byResource = new Map<string, PermissionLookupDto[]>();
  for (const permission of permissions.filter(isBackOfficeFeaturePermission)) {
    const key = permission.resource ?? permission.name ?? String(permission.id);
    const bucket = byResource.get(key) ?? [];
    bucket.push(permission);
    byResource.set(key, bucket);
  }

  return [...byResource.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([resource, items]) => {
      const sorted = [...items].sort(
        (left, right) => left.displayOrder - right.displayOrder,
      );
      const view = sorted.find((item) => isViewAction(item.action));
      const createEdit = sorted.find((item) => isCreateEditAction(item.action));
      return {
        key: resource,
        label: resource,
        viewPermissionId: view?.id,
        createEditPermissionId: createEdit?.id,
      };
    });
};

export const groupMobilePermissions = (
  permissions: readonly PermissionLookupDto[],
): MobilePermissionGroup[] => {
  const byGroup = new Map<string, PermissionLookupDto[]>();
  for (const permission of permissions.filter(isMobilePermission)) {
    const group = permission.resource ?? 'Mobile';
    const bucket = byGroup.get(group) ?? [];
    bucket.push(permission);
    byGroup.set(group, bucket);
  }

  return [...byGroup.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([group, items]) => ({
      group,
      items: [...items].sort(
        (left, right) => left.displayOrder - right.displayOrder,
      ),
    }));
};

export const listSettingsPermissions = (
  permissions: readonly PermissionLookupDto[],
): PermissionLookupDto[] =>
  permissions
    .filter(isSettingsPermission)
    .sort((left, right) => left.displayOrder - right.displayOrder);
