# Global Top Navigation & Sidebar

### Product Requirements Document

## 1. Overview

This PRD covers the persistent navigation shell for the FieldPro application: a left-hand sidebar and a top navigation bar. Together they give users a consistent way to move between every major area of the product — dispatch, sales, work, payments, purchasing, and reporting — no matter which page they're on. The design reference is the "TodayPage" frame from the Service-Location Figma file, which shows the shell wrapping the Service Locations page.

## 2. Problem Statement

FieldPro's core workflows (jobs, sales, payments, purchasing, reporting) currently live behind a navigation pattern that isn't specified elsewhere in this request, so this spec assumes the standard problem a persistent nav shell solves: without a single, consistent wrapper, each page risks reinventing navigation, users lose track of where they are in the product, and new sections (like the newly-added Service Locations area) have no obvious place to live. Building the shell once, as a reusable layout, removes that duplication and gives every future page the same wayfinding for free.

> _Assumption — flagged in Open Questions: the specific pain point driving this request wasn't provided. Confirm before treating the above as the source of truth._

## 3. Goals

- Ship a reusable sidebar + top nav shell that wraps every authenticated page in FieldPro (For routes use react router).
- Group navigation items to match the information architecture shown in the design: primary items, then SALES, WORK, PAYMENTS, PURCHASE, and REPORTS sections.
- Clearly indicate the current page via an active/selected state in the sidebar.
- Support a collapsible sidebar to reclaim horizontal space for content-heavy pages.
- Surface global utilities (search, notifications, account switcher, user menu) in the top nav so they're available from anywhere (this spec only covers UI for search, notification, user menu- with options like logout, settings).
- Mobile or tablet layouts — achieve standard responsive behavior.

## 4. Non-Goals

- The content/functionality of the destination pages themselves (e.g. Dashboard, Dispatch Board) — those are specified separately.

## 5. User Stories

- As a FieldPro user, I want a persistent sidebar so that I can jump between Jobs, Dispatch, Customers, Service Locations, and other sections without losing my place.
- As a user working across multiple business units, I want to see and switch the active workspace (e.g. "Graceful Cleaning") from the top nav.
- As a user, I want to search from anywhere in the app so that I don't have to navigate to a specific page to find a record (for now add it as UI only no functionality needed).
- As a user, I want to see how many unread notifications I have so that I know when something needs my attention(for now add it as UI only no functionality needed).
- As a user on a smaller screen or focused on data-heavy work, I want to collapse the sidebar so that I get more room for page content.
- As a user, I want quick access to my account (avatar, initials, and a menu) so that I can manage my profile or sign out.

## 6. Design Reference

- figma url: https://www.figma.com/design/dBJ6OGSYgq8bIVL4gt0uMK/Service-Location?node-id=2-5&t=Wl3uE3Pyf70SoPoc-0
- screenshot if needed /context/screenshots/top-nav-sidebar.jpg

### 6.1 Sidebar (fixed width ~210px, white background, right border)

- Header: FieldPro logomark + wordmark.
- Primary action: full-width "+ Create New" button (brand blue, `#1741B0`).
- Primary nav items (flat list, icon + label): Today, Dashboard, Jobs / Work Orders, Dispatch Board, Customers, Service Locations.
- Active item ("Service Locations" in the reference) uses a light blue background (`#EFF6FF`), blue text/icon (`#1741B0`), and semibold label weight — all other items use gray text (`#374151`) and regular weight.
- Grouped sections below the primary list, each with a small uppercase gray label and its own item list:
  - **SALES** — Lead, Invoice, Estimate, Service Agreements
  - **WORK** — Capacity Planning, Projects
  - **PAYMENTS** — Payments, Schedule Payment, Refunds
  - **PURCHASE** — Purchase Orders, Returns, Vendors
  - **REPORTS** — Reports
- Footer: a "Collapse" control (icon + label) pinned to the bottom of the sidebar, above the border.

### 6.2 Top Nav (fixed height 56px, white background, bottom border)

- Workspace switcher: current workspace name ("Graceful Cleaning") with a dropdown chevron.
- Global search input with a search icon and "Search anything..." placeholder, expanding to fill available space up to a max width.
- A row of icon-only utility buttons (exact destinations not labeled in the design — see Open Questions).
- A notification bell with a small red unread-count badge (showing "5" in the reference).
- User menu: circular avatar with initials ("JD") on a brand-blue background, plus a dropdown chevron.

## 7. Functional Requirements

| #   | Requirement                                                                                                                                                                                                |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The sidebar must render the FieldPro logo and wordmark at the top, above all navigation content.                                                                                                           |
| 2   | The sidebar must render a full-width "Create New" call-to-action button below the header.                                                                                                                  |
| 3   | The sidebar must render the primary navigation items (Today, Dashboard, Jobs / Work Orders, Dispatch Board, Customers, Service Locations) as a flat, ungrouped list.                                       |
| 4   | The sidebar must render the SALES, WORK, PAYMENTS, PURCHASE, and REPORTS sections below the primary list, each with a section label and its own items, in the order shown in the design.                   |
| 5   | The system must visually mark the navigation item matching the current route as active (light-blue background, blue icon/text, semibold label), and this must update automatically when the route changes. |
| 6   | The sidebar must include a "Collapse" control at the bottom that toggles the sidebar between its full width and a collapsed (icon-only) state.                                                             |
| 7   | The top nav must display the current workspace/company name with a control to switch workspaces.                                                                                                           |
| 8   | The top nav must include a search input that accepts free text; behavior on submit/results is out of scope for this spec and should be defined separately.                                                 |
| 9   | The top nav must display a notification icon with a numeric unread-count badge that updates as notifications are read or received.                                                                         |
| 10  | The top nav must display the current user's avatar (initials as a fallback) with a menu for account-related actions.                                                                                       |
| 11  | The navigation shell (sidebar + top nav) must persist across all authenticated pages rather than being re-implemented per page.                                                                            |

## 8. Edge Cases & Error States

- Notification count exceeding a reasonable display size (e.g. 99+) — needs a defined display format ("9+", "99+", etc.).
- Long workspace, item, or user names that would overflow their container — needs truncation or wrapping rules.
- Search with no matching results, or search triggered with an empty query.
- Collapsed sidebar state — item labels are hidden; icon-only items should have tooltips or accessible labels so meaning isn't lost.
- Keyboard navigation and focus states for all interactive nav elements (accessibility requirement, not explicitly shown in the static design).
- A logged-in user with no avatar image and no initials available (fallback state).

## 9. Success Metrics

- Time-to-navigate: reduction in time users take to reach a given section from an arbitrary starting page.
- Drop in support/feedback mentioning difficulty finding a feature or page.
- Adoption rate of the sidebar collapse control, as a signal the layout serves both dense and content-focused workflows.
- No regression in task completion rates for core flows (Jobs, Dispatch, Customers) after the shell rolls out.
