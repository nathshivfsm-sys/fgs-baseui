import {
  Button,
  cn,
  CollapseIcon,
  FieldProLogoIcon,
  PlusIcon,
} from '@cms/ui';
import { NavLink } from 'react-router-dom';
import { NAV_SECTIONS, PRIMARY_NAV_ITEMS, type NavItem } from './nav-config';

const NAV_ITEM_CLASSES =
  'flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-control text-control-foreground transition-colors hover:bg-secondary';
const NAV_ITEM_ACTIVE_CLASSES =
  'bg-brand-blue-subtle font-semibold text-brand-blue hover:bg-brand-blue-subtle';

function SidebarNavLink({
  collapsed,
  item,
  onNavigate,
}: {
  collapsed: boolean;
  item: NavItem;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(NAV_ITEM_CLASSES, collapsed && 'justify-center px-0', isActive && NAV_ITEM_ACTIVE_CLASSES)
      }
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      to={item.path}
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden="true"
            className={cn(
              'size-[15px] shrink-0',
              isActive ? 'text-brand-blue' : 'text-nav-section',
            )}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

export interface SidebarProps {
  className?: string;
  collapsed: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
  showCollapseControl?: boolean;
}

/** Persistent left navigation shell: logo, Create New CTA, primary nav, and grouped sections. */
export function Sidebar({
  className,
  collapsed,
  onNavigate,
  onToggleCollapse,
  showCollapseControl = true,
}: SidebarProps) {
  return (
    <aside
      aria-label="Primary"
      className={cn(
        'flex h-full flex-col border-r border-divider bg-card transition-[width]',
        collapsed ? 'w-16' : 'w-[210px]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border-soft p-4">
        <FieldProLogoIcon aria-hidden="true" className="size-7 shrink-0" />
        {!collapsed && (
          <p className="truncate text-body font-bold text-heading">FieldPro</p>
        )}
      </div>

      <div className="p-3">
        <Button
          aria-label="Create New"
          className="w-full justify-center gap-2 bg-brand-blue text-brand-blue-foreground hover:bg-brand-blue/90 active:bg-brand-blue/80"
          size={collapsed ? 'icon' : 'default'}
        >
          <PlusIcon aria-hidden="true" className="size-3.5 shrink-0" />
          {!collapsed && 'Create New'}
        </Button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
        <div className="flex flex-col gap-1">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <SidebarNavLink
              collapsed={collapsed}
              item={item}
              key={item.path}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {NAV_SECTIONS.map((section) => (
          <div className="flex flex-col gap-1 pt-1" key={section.label}>
            {!collapsed && (
              <p className="px-3 py-1.5 text-caption font-semibold uppercase tracking-section text-nav-section">
                {section.label}
              </p>
            )}
            {section.items.map((item) => (
              <SidebarNavLink
                collapsed={collapsed}
                item={item}
                key={item.path}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      {showCollapseControl && (
        <div className="border-t border-divider p-3">
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex h-5 items-center gap-2 text-control text-muted-foreground hover:text-control-foreground',
              collapsed && 'w-full justify-center',
            )}
            onClick={onToggleCollapse}
            type="button"
          >
            <CollapseIcon
              aria-hidden="true"
              className={cn('size-4 shrink-0', collapsed && 'rotate-180')}
            />
            {!collapsed && 'Collapse'}
          </button>
        </div>
      )}
    </aside>
  );
}
