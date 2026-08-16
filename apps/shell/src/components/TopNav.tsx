import type { UserDetails } from '@cms/platform-contract';
import {
  BellIcon,
  ChevronDownIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  MenuIcon,
  SearchIcon,
  TextInput,
} from '@cms/ui';
import { formatBadgeCount, getInitials } from '../lib/format';
import { TENANT_NAMES } from '../store/constants';

export interface TopNavProps {
  currentUser: UserDetails;
  notificationCount?: number;
  onOpenMobileSidebar: () => void;
  onTenantChange: (tenantId: string) => void;
  tenantId: string;
}

/** Persistent top bar: workspace switcher, global search, notifications, and user menu. */
export function TopNav({
  currentUser,
  notificationCount = 5,
  onOpenMobileSidebar,
  onTenantChange,
  tenantId,
}: TopNavProps) {
  return (
    <header className="flex h-topbar shrink-0 items-center gap-3 border-b border-divider bg-card px-4 sm:px-5">
      <IconButton
        className="lg:hidden!"
        icon={<MenuIcon className="size-4" />}
        label="Open navigation"
        onClick={onOpenMobileSidebar}
        variant="ghost"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex shrink-0 items-center gap-1.5 text-control font-semibold text-heading outline-none"
            type="button"
          >
            <span className="max-w-32 truncate sm:max-w-none">
              {TENANT_NAMES[tenantId] ?? tenantId}
            </span>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-3.5 shrink-0 text-muted-foreground"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
          {Object.entries(TENANT_NAMES).map(([id, name]) => (
            <DropdownMenuItem key={id} onSelect={() => onTenantChange(id)}>
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="max-w-[380px] flex-1">
        <TextInput
          aria-label="Search anything"
          className="border-divider bg-background"
          placeholder="Search anything..."
          startAdornment={<SearchIcon className="size-3.5" />}
          type="search"
        />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <div className="relative">
          <IconButton
            icon={<BellIcon className="size-[18px]" />}
            label="Notifications"
            variant="ghost"
          />
          {notificationCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute right-1 top-1 flex size-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground"
            >
              {formatBadgeCount(notificationCount)}
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className="flex items-center gap-1 rounded-full outline-none"
              type="button"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-blue text-caption font-bold text-brand-blue-foreground">
                {getInitials(currentUser.displayName) || '?'}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className="size-3 shrink-0 text-muted-foreground"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <p className="text-control font-semibold text-card-foreground">
                {currentUser.displayName}
              </p>
              <p className="font-normal text-muted-foreground">
                {currentUser.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
