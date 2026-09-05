import { useNavigate } from 'react-router-dom';
import type { UserDetails } from '@cms/platform-contract';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  BellIcon,
  ChevronDownIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FieldProLogoIcon,
  IconButton,
  MenuIcon,
  MessageIcon,
  PhoneIcon,
  SearchIcon,
  SettingsIcon,
  TextInput,
} from '@cms/ui';
import { formatBadgeCount, getInitials } from '../lib/format';
import { TENANT_NAMES } from '../store/constants';

/**
 * Icon buttons sit on `--topnav`, where the shared `ghost` variant's accent
 * hover and `--ring` focus ring both disappear into the blue.
 */
const TOPNAV_ICON_CLASSES =
  'text-surface-inverse-foreground hover:bg-surface-inverse-hover hover:text-surface-inverse-foreground active:bg-surface-inverse-hover focus-visible:ring-surface-inverse-foreground/70';

export interface TopNavProps {
  currentUser: UserDetails;
  notificationCount?: number;
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
  tenantId: string;
}

/** Persistent brand bar: identity, global search, utilities, and the account menu. */
export function TopNav({
  currentUser,
  notificationCount = 5,
  onLogout,
  onOpenMobileSidebar,
  tenantId,
}: TopNavProps) {
  const navigate = useNavigate();
  const tenantName = TENANT_NAMES[tenantId] ?? tenantId;
  const initials = getInitials(currentUser.displayName) || '?';

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-divider bg-surface-inverse px-4 text-surface-inverse-foreground sm:px-5">
      <IconButton
        className={`lg:hidden! ${TOPNAV_ICON_CLASSES}`}
        icon={<MenuIcon className="size-4" />}
        label="Open navigation"
        onClick={onOpenMobileSidebar}
        variant="ghost"
      />

      <div className="flex w-47 shrink-0 items-center gap-2">
        <FieldProLogoIcon aria-hidden="true" className="size-7 shrink-0" />
        <span className="text-body font-bold sm:block">FieldPro</span>
      </div>

      {/* FR-4: never wraps, never squeezes the search field. Below `nav`
          there's no room for it alongside search + the icon cluster, so it
          relocates into the account dropdown instead (see below). */}
      <p
        className="hidden min-w-0 truncate text-tenant font-semibold nav:block"
        title={tenantName}
      >
        {tenantName}
      </p>

      <div className="ml-auto mr-10 w-full min-w-0 max-w-95">
        <TextInput
          aria-label="Search anything"
          className="border-divider bg-surface-sunken"
          inputClassName="placeholder:text-foreground-subtle"
          placeholder="Search anything..."
          startAdornment={<SearchIcon className="size-3.5" />}
          type="search"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton
          className={`hidden md:inline-flex! ${TOPNAV_ICON_CLASSES}`}
          icon={<PhoneIcon className="size-6" />}
          label="Calls"
          size="lg"
          variant="ghost"
        />
        <IconButton
          className={`hidden md:inline-flex! ${TOPNAV_ICON_CLASSES}`}
          icon={<MessageIcon className="size-6" />}
          label="Messages"
          size="lg"
          variant="ghost"
        />

        <div className="relative">
          <IconButton
            className={TOPNAV_ICON_CLASSES}
            icon={<BellIcon className="size-6" />}
            label={
              notificationCount > 0
                ? `Notifications, ${formatBadgeCount(notificationCount)} unread`
                : 'Notifications'
            }
            size="lg"
            variant="ghost"
          />
          {notificationCount > 0 && (
            // Widens to a pill past a single digit rather than clipping.
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-badge font-bold text-destructive-foreground"
            >
              {formatBadgeCount(notificationCount)}
            </span>
          )}
        </div>

        <IconButton
          className={`hidden sm:inline-flex! ${TOPNAV_ICON_CLASSES}`}
          icon={<SettingsIcon className="size-7" />}
          label="Settings"
          size="lg"
          variant="ghost"
          onClick={() => navigate('/settings')}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Account menu for ${currentUser.displayName}`}
            className="flex items-center gap-1 rounded-md px-1 py-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-surface-inverse-foreground/70"
          >
            <Avatar className="size-8 after:border-surface-inverse-foreground/25">
              <AvatarImage
                alt=""
                src={currentUser.avatarUrl}
                // FR-8: an absent, slow, or broken src falls through to initials.
              />
              <AvatarFallback className="bg-accent-surface text-caption font-bold text-accent-surface-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-left leading-4 sm:block">
              <span className="block text-control font-bold">
                {currentUser.displayName}
              </span>
              {currentUser.role && (
                <span className="block text-caption font-medium">
                  {currentUser.role}
                </span>
              )}
            </span>
            <ChevronDownIcon aria-hidden="true" className="size-3 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Mirrors the bar's tenant name below `nav`, where there's no
                room to show it inline (see the `<p>` above). */}
            <DropdownMenuGroup className="hidden max-nav:block">
              <DropdownMenuLabel>
                <p
                  className="truncate text-control font-semibold text-surface-foreground"
                  title={tenantName}
                >
                  {tenantName}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="hidden max-nav:block" />
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <p className="text-control font-semibold text-surface-foreground">
                  {currentUser.displayName}
                </p>
                <p className="font-normal text-foreground-muted">
                  {currentUser.email}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
