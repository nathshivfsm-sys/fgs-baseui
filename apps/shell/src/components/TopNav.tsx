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
  'text-topnav-foreground hover:bg-topnav-hover hover:text-topnav-foreground active:bg-topnav-hover focus-visible:ring-topnav-foreground/70';

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
  const tenantName = TENANT_NAMES[tenantId] ?? tenantId;
  const initials = getInitials(currentUser.displayName) || '?';

  return (
    <header className="flex h-topbar shrink-0 items-center gap-3 border-b border-topnav-border bg-topnav px-4 text-topnav-foreground sm:px-5">
      <IconButton
        className={`lg:hidden! ${TOPNAV_ICON_CLASSES}`}
        icon={<MenuIcon className="size-4" />}
        label="Open navigation"
        onClick={onOpenMobileSidebar}
        variant="ghost"
      />

      <div className="flex w-topnav-identity shrink-0 items-center gap-2">
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

      <div className="ml-auto mr-10 w-full min-w-0 max-w-topnav-search">
        <TextInput
          aria-label="Search anything"
          className="border-topnav-search-border bg-topnav-search"
          inputClassName="placeholder:text-topnav-search-placeholder"
          placeholder="Search anything..."
          startAdornment={<SearchIcon className="size-3.5" />}
          type="search"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <IconButton
          className={`hidden md:inline-flex! ${TOPNAV_ICON_CLASSES}`}
          icon={<PhoneIcon className="size-topnav-icon" />}
          label="Calls"
          size="lg"
          variant="ghost"
        />
        <IconButton
          className={`hidden md:inline-flex! ${TOPNAV_ICON_CLASSES}`}
          icon={<MessageIcon className="size-topnav-icon" />}
          label="Messages"
          size="lg"
          variant="ghost"
        />

        <div className="relative">
          <IconButton
            className={TOPNAV_ICON_CLASSES}
            icon={<BellIcon className="size-topnav-icon" />}
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
              className="pointer-events-none absolute right-1 top-0.5 flex h-topnav-badge min-w-topnav-badge items-center justify-center rounded-full bg-destructive px-1 text-badge font-bold text-destructive-foreground"
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
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Account menu for ${currentUser.displayName}`}
            className="flex items-center gap-1 rounded-md px-1 py-0.5 outline-none focus-visible:ring-[3px] focus-visible:ring-topnav-foreground/70"
          >
            <Avatar className="size-topnav-avatar after:border-topnav-foreground/25">
              <AvatarImage
                alt=""
                src={currentUser.avatarUrl}
                // FR-8: an absent, slow, or broken src falls through to initials.
              />
              <AvatarFallback className="bg-avatar-fallback text-caption font-bold text-avatar-fallback-foreground">
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
                  className="truncate text-control font-semibold text-card-foreground"
                  title={tenantName}
                >
                  {tenantName}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="hidden max-nav:block" />
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <p className="text-control font-semibold text-card-foreground">
                  {currentUser.displayName}
                </p>
                <p className="font-normal text-muted-foreground">
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
