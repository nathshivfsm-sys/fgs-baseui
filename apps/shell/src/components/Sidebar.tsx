import { BodySmall, Button, cn, CollapseIcon, PlusIcon } from '@cms/ui';
import { NavLink, useMatch } from 'react-router-dom';
import { NAV_SECTIONS, PRIMARY_NAV_ITEMS, type NavItem } from './nav-config';

const NAV_ITEM_CLASSES =
  'flex w-full items-center text-control text-foreground transition-colors hover:bg-secondary';
const NAV_ITEM_EXPANDED_CLASSES = 'h-9 gap-2.5 rounded-md px-3';
/**
 * Collapsed items stack the label under the icon and let it wrap, so the row
 * grows to fit rather than running at the expanded state's fixed 36px.
 */
const NAV_ITEM_COLLAPSED_CLASSES =
  'flex-col justify-center gap-1 px-1 py-2 text-center text-caption leading-tight';
const NAV_ITEM_ACTIVE_CLASSES =
  'bg-action-subtle text-primary hover:bg-action-subtle';

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
  const isActive = useMatch({ path: item.path, end: false }) !== null;

  return (
    <NavLink
      className={cn(
        NAV_ITEM_CLASSES,
        collapsed ? NAV_ITEM_COLLAPSED_CLASSES : NAV_ITEM_EXPANDED_CLASSES,
        isActive && NAV_ITEM_ACTIVE_CLASSES,
      )}
      onClick={onNavigate}
      to={item.path}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'shrink-0',
          collapsed ? 'size-5' : 'size-4',
          isActive ? 'text-primary' : 'text-foreground-subtle',
        )}
      />
      <span className={cn(!collapsed && 'truncate')}>{item.label}</span>
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

/** Persistent left navigation: Create New CTA, primary nav, and grouped sections. */
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
        // `divider` rather than `border-subtle` for the shell seam: subtle is
        // #2e323c in dark, only 1.14:1 against the surface, so the edge all but
        // disappears. divider tracks the original value in both schemes.
        'flex h-full flex-col border-r border-divider bg-surface transition-[width]',
        collapsed ? 'w-24' : 'w-52',
        className,
      )}
    >
      <div className="p-3 text-center">
        <Button
          aria-label="Create New"
          className={cn(
            'gap-2 bg-primary text-action-foreground hover:bg-primary/90 active:bg-primary/80',
            !collapsed && 'w-full justify-center',
          )}
          size={collapsed ? 'icon' : 'lg'}
        >
          <PlusIcon
            aria-hidden="true"
            className={cn('shrink-0', collapsed ? 'size-5' : 'size-4')}
          />
          {!collapsed && 'Create New'}
        </Button>
      </div>

      <nav
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-y-auto pb-2',
          !collapsed && 'gap-1 px-2',
        )}
      >
        <div className={cn('flex flex-col', !collapsed && 'gap-1')}>
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
          <div
            className={cn(
              'flex flex-col',
              collapsed ? 'mt-1 border-t border-border pt-1' : 'gap-1 pt-1',
            )}
            key={section.label}
          >
            {/* FR-22: the label is what a hairline replaces when collapsed. */}
            {!collapsed && (
              <BodySmall
                className="px-3 py-1.5 text-caption font-semibold tracking-section"
                color="foreground-subtle"
                isUpperCase
              >
                {section.label}
              </BodySmall>
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
        <div
          className={cn(
            'flex h-11 shrink-0 items-center border-t border-border px-3',
            collapsed ? 'justify-center' : 'justify-end',
          )}
        >
          <button
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex items-center gap-2 rounded-sm text-control text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
