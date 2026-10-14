import { Heading3 } from '@cms/ui';
import { groupMobilePermissions } from '../util';
import type { MobilePermissionsTabProps } from '../types';
import { PermissionToggle } from './PermissionToggle';

export const MobilePermissionsTab = ({
  canEdit,
  catalog,
  onTogglePermission,
  selectedPermissionIds,
}: MobilePermissionsTabProps) => {
  const groups = groupMobilePermissions(catalog);

  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      {groups.map((group) => (
        <section key={group.group}>
          <Heading3 className="mb-3">{group.group}</Heading3>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((permission) => (
              <label
                className="flex items-center gap-2 text-body-sm text-foreground"
                htmlFor={`mobile-permission-${permission.id}`}
                key={permission.id}
              >
                <PermissionToggle
                  checked={selectedPermissionIds.has(permission.id)}
                  disabled={!canEdit}
                  id={`mobile-permission-${permission.id}`}
                  label={permission.name ?? 'Permission'}
                  onCheckedChange={(next) =>
                    onTogglePermission(permission.id, next)
                  }
                />
                <span>{permission.name}</span>
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
