# Current Feature

## Status

Implemented and verified in browser (dev server, Playwright). Build and typecheck pass. Not yet
committed — awaiting go-ahead.

## Goals

Implement `context/features/top-nav-sidebar-prd.md`: a persistent left sidebar + top nav shell
wrapping every authenticated page in the `shell` app.

- Sidebar: FieldPro logo, "Create New" CTA, flat primary nav (Today, Dashboard, Jobs / Work
  Orders, Dispatch Board, Customers, Service Locations), grouped sections (SALES, WORK, PAYMENTS,
  PURCHASE, REPORTS), active-route highlighting, collapse-to-icons toggle.
- Top nav: workspace switcher (wired to existing `shellStore.tenantId`), search input (UI only),
  notification bell with unread badge (UI only), user menu (avatar/initials + logout/settings).
- Responsive: sidebar becomes an off-canvas drawer below the `md` breakpoint.
- Pixel-accurate icons/colors pulled from the Figma file referenced in the PRD via the Figma MCP
  server, added to `libs/ui/src/icons`.

## Notes

Decisions made with the user before implementation:

- Icons: hand-traced from Figma (not lucide-react), matching the existing `createFigmaIcon`
  pattern in `libs/ui/src/icons`.
- Nav items without a real MFE yet (Today, Dashboard, Customers, Service Locations, Invoice,
  Estimate, etc.) route to a minimal placeholder page that shows the active nav item (and its
  section, e.g. "Sales / Lead") so navigation and active-state are demonstrably correct without
  building out full page content (out of scope per PRD non-goals).
- The top nav's unlabeled utility icon row (between search and notifications) is intentionally
  omitted — the PRD explicitly scopes the top nav spec to search, notifications, and the user
  menu only (Goals, line 20) and flags that icon row's destinations as unconfirmed (Open
  Questions).
- Added two new tokens, `--brand-blue` / `--brand-blue-subtle` (light `#1741b0` / `#eff6ff`), to
  `libs/ui/src/styles/tokens.css` for the exact PRD-specified "brand blue" used by the CTA button,
  active nav state, and avatar — distinct from the existing `--brand` token so no unrelated
  component's color changes.
- Added `@radix-ui/react-dropdown-menu` to `libs/ui` for the workspace switcher and user menu,
  matching the existing Radix-primitive pattern already used for Select/Switch/Tabs/RadioGroup.

## History
