import {
  BodySmall,
  Button,
  Callout,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@cms/ui';
import {
  CANCEL_LABEL,
  CLONE_ROLE_LABEL,
  DELETE_ROLE_MENU_LABEL,
  NO_ROLE_SELECTED,
  SAVE_LABEL,
  SYSTEM_BADGE,
  SYSTEM_ROLE_CALLOUT,
  SYSTEM_ROLE_HINT,
  TAB_BACK_OFFICE,
  TAB_MOBILE,
  TAB_USERS,
} from '../constant';
import type { RoleDetailPanelProps } from '../types';
import { BackOfficePermissionsTab } from './BackOfficePermissionsTab';
import { MobilePermissionsTab } from './MobilePermissionsTab';
import { RoleUsersTab } from './RoleUsersTab';

export const RoleDetailPanel = ({
  activeTab,
  allowedPermissionIds,
  canEdit,
  dirty,
  userCount,
  users,
  usersLoading,
  onCancel,
  onDeleteRole,
  onOpenCloneDialog,
  onSave,
  onTabChange,
  onTogglePermission,
  permissionCatalog,
  permissionCatalogLoading,
  permissionsLoading,
  roleLoading,
  roleName,
  savePending,
  selectedPermissionIds,
  seeded,
}: RoleDetailPanelProps) => {
  if (roleLoading || !roleName) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-border bg-surface p-8">
        {roleLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <BodySmall color="foreground-subtle">{NO_ROLE_SELECTED}</BodySmall>
        )}
      </div>
    );
  }

  const usersTabLabel = `${TAB_USERS} (${userCount})`;

  const handleTabChange = (value: string) => {
    if (value === 'back-office' || value === 'mobile' || value === 'users') {
      onTabChange(value);
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="border-b border-border-subtle px-6 pb-4 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-heading-3 font-bold text-foreground">
              {roleName}
            </h2>
            {seeded ? (
              <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-800">
                {SYSTEM_BADGE}
              </span>
            ) : null}
          </div>
          {!seeded ? (
            <Button onClick={onDeleteRole} size="sm" variant="outline">
              {DELETE_ROLE_MENU_LABEL}
            </Button>
          ) : null}
        </div>
        {seeded ? (
          <BodySmall className="mt-1" color="foreground-subtle">
            {SYSTEM_ROLE_HINT}
          </BodySmall>
        ) : null}
        {seeded ? (
          <Callout className="mt-3" variant="info">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <BodySmall color="foreground">{SYSTEM_ROLE_CALLOUT}</BodySmall>
              <Button onClick={onOpenCloneDialog} size="sm" variant="outline">
                {CLONE_ROLE_LABEL}
              </Button>
            </div>
          </Callout>
        ) : null}
      </div>

      <Tabs
        className="flex min-h-0 flex-1 flex-col"
        onValueChange={handleTabChange}
        value={activeTab}
      >
        <TabsList bordered className="px-6">
          <TabsTrigger value="back-office">{TAB_BACK_OFFICE}</TabsTrigger>
          <TabsTrigger value="mobile">{TAB_MOBILE}</TabsTrigger>
          <TabsTrigger value="users">{usersTabLabel}</TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent className="mt-0 h-full" value="back-office">
            {permissionCatalogLoading || permissionsLoading ? (
              <div className="space-y-3 px-6 py-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : (
              <BackOfficePermissionsTab
                allowedPermissionIds={allowedPermissionIds}
                canEdit={canEdit}
                catalog={permissionCatalog}
                onTogglePermission={onTogglePermission}
                selectedPermissionIds={selectedPermissionIds}
              />
            )}
          </TabsContent>
          <TabsContent className="mt-0 h-full" value="mobile">
            {permissionCatalogLoading || permissionsLoading ? (
              <div className="space-y-3 px-6 py-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <MobilePermissionsTab
                allowedPermissionIds={allowedPermissionIds}
                canEdit={canEdit}
                catalog={permissionCatalog}
                onTogglePermission={onTogglePermission}
                selectedPermissionIds={selectedPermissionIds}
              />
            )}
          </TabsContent>
          <TabsContent className="mt-0 h-full" value="users">
            <RoleUsersTab
              loading={usersLoading}
              roleName={roleName}
              users={users}
            />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex justify-end gap-2 border-t border-border-subtle px-6 py-3">
        <Button
          disabled={!dirty || savePending}
          onClick={onCancel}
          variant="outline"
        >
          {CANCEL_LABEL}
        </Button>
        <Button
          disabled={!canEdit || !dirty || savePending}
          loading={savePending}
          onClick={onSave}
        >
          {SAVE_LABEL}
        </Button>
      </div>
    </section>
  );
};
