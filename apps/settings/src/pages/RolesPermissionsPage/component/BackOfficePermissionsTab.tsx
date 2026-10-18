import { BodySmall, Heading3 } from '@cms/ui';
import type { PermissionLookupDto } from '@cms/user-contract';
import {
  CREATE_EDIT_COLUMN_LABEL,
  MODULE_FEATURE_HEADER,
  SETTINGS_SECTION_TITLE,
  VIEW_COLUMN_LABEL,
} from '../constant';
import { buildFeaturePermissionRows, listSettingsPermissions } from '../util';
import type { BackOfficePermissionsTabProps } from '../types';
import { PermissionToggle } from './PermissionToggle';

export const BackOfficePermissionsTab = ({
  allowedPermissionIds,
  canEdit,
  catalog,
  onTogglePermission,
  selectedPermissionIds,
}: BackOfficePermissionsTabProps) => {
  const featureRows = buildFeaturePermissionRows(catalog);
  const settingsPermissions = listSettingsPermissions(catalog);

  const renderToggleCell = (
    permissionId: number | undefined,
    label: string,
  ) => (
    <div className="flex items-center justify-center">
      {permissionId === undefined ? (
        <span aria-hidden className="size-4 shrink-0" />
      ) : (
        <PermissionToggle
          checked={selectedPermissionIds.has(permissionId)}
          disabled={!canEdit || !allowedPermissionIds.has(permissionId)}
          id={`permission-${permissionId}`}
          label={label}
          onCheckedChange={(next) => onTogglePermission(permissionId, next)}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-6 py-4">
      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_180px_180px] items-center border-b border-border-subtle pb-2">
          <BodySmall className="font-semibold text-foreground-subtle">
            {MODULE_FEATURE_HEADER}
          </BodySmall>
          <BodySmall className="text-center font-semibold text-foreground-subtle">
            {VIEW_COLUMN_LABEL}
          </BodySmall>
          <BodySmall className="text-center font-semibold text-foreground-subtle">
            {CREATE_EDIT_COLUMN_LABEL}
          </BodySmall>
        </div>
        {featureRows.map((row) => (
          <div
            className="grid grid-cols-[minmax(0,1fr)_180px_180px] items-center border-b border-border-subtle/60 py-2.5"
            key={row.key}
          >
            <span className="text-body-sm text-foreground">{row.label}</span>
            {renderToggleCell(row.viewPermissionId, `${row.label} view`)}
            {renderToggleCell(
              row.createEditPermissionId,
              `${row.label} create/edit`,
            )}
          </div>
        ))}
      </div>

      <div>
        <Heading3 className="mb-3">{SETTINGS_SECTION_TITLE}</Heading3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {settingsPermissions.map((permission: PermissionLookupDto) => (
            <label
              className="flex items-center gap-2 text-body-sm text-foreground"
              htmlFor={`settings-permission-${permission.id}`}
              key={permission.id}
            >
              <PermissionToggle
                checked={selectedPermissionIds.has(permission.id)}
                disabled={!canEdit || !allowedPermissionIds.has(permission.id)}
                id={`settings-permission-${permission.id}`}
                label={permission.name ?? permission.resource ?? 'Setting'}
                onCheckedChange={(next) =>
                  onTogglePermission(permission.id, next)
                }
              />
              <span>{permission.name ?? permission.resource}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
