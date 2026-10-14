import { BodySmall, LockIcon, cn } from '@cms/ui';
import {
  CUSTOM_BADGE,
  CUSTOM_ROLES_LABEL,
  ROLES_PANEL_TITLE,
  SEEDED_BADGE,
  SEEDED_ROLES_LABEL,
  USERS_COUNT_SUFFIX,
} from '../constant';
import type { RoleListPanelProps } from '../types';

const RoleListItem = ({
  active,
  badge,
  badgeTone,
  count,
  locked,
  name,
  onSelect,
}: {
  active: boolean;
  badge: string;
  badgeTone: 'seeded' | 'custom';
  count: number;
  locked?: boolean;
  name: string;
  onSelect: () => void;
}) => (
  <button
    className={cn(
      'flex w-full items-center justify-between px-3.5 py-3 text-left transition-colors',
      active ? 'bg-primary/10' : 'bg-surface hover:bg-secondary/60',
    )}
    onClick={onSelect}
    type="button"
  >
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'text-body-sm font-semibold',
            active ? 'text-primary' : 'text-foreground',
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            'rounded px-1.5 py-px text-[10px] font-semibold',
            badgeTone === 'seeded'
              ? 'bg-violet-100 text-violet-800'
              : 'bg-emerald-100 text-emerald-800',
          )}
        >
          {badge}
        </span>
      </div>
      <BodySmall color="foreground-subtle">
        {count} {USERS_COUNT_SUFFIX}
      </BodySmall>
    </div>
    {locked ? (
      <LockIcon className="size-3.5 shrink-0 text-foreground-subtle" />
    ) : null}
  </button>
);

export const RoleListPanel = ({
  customRoles,
  employeeCountByRole,
  onSelectRole,
  selectedRoleId,
  seededRoles,
}: RoleListPanelProps) => (
  <aside className="flex h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-surface">
    <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-3.5">
      <span className="text-body-sm font-semibold text-foreground">
        {ROLES_PANEL_TITLE}
      </span>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto">
      <p className="px-3.5 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">
        {SEEDED_ROLES_LABEL}
      </p>
      {seededRoles.map((role) => (
        <RoleListItem
          active={role.id === selectedRoleId}
          badge={SEEDED_BADGE}
          badgeTone="seeded"
          count={employeeCountByRole.get(role.id) ?? 0}
          key={role.id}
          locked
          name={role.name ?? role.roleCode ?? `Role ${role.id}`}
          onSelect={() => onSelectRole(role.id)}
        />
      ))}
      <p className="px-3.5 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">
        {CUSTOM_ROLES_LABEL}
      </p>
      {customRoles.length === 0 ? (
        <BodySmall className="px-3.5 py-2" color="foreground-subtle">
          No custom roles yet.
        </BodySmall>
      ) : (
        customRoles.map((role) => (
          <RoleListItem
            active={role.id === selectedRoleId}
            badge={CUSTOM_BADGE}
            badgeTone="custom"
            count={employeeCountByRole.get(role.id) ?? 0}
            key={role.id}
            name={role.name ?? role.roleCode ?? `Role ${role.id}`}
            onSelect={() => onSelectRole(role.id)}
          />
        ))
      )}
    </div>
  </aside>
);
