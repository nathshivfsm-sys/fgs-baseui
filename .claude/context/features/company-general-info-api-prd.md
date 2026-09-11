# Company General Info — API-backed edit form

**Status:** Spec, not started. **Branch (proposed):** `feature/company-general-info-api`, cut
from `feature/api-login-access-token` (it needs both the real login and the existing
settings remote, and neither is merged to `develop` yet).

**Design:** Figma `fKuNuVXQThJ9uPGq8FECm3`, node `75-6519` ("Login (Copy)" file). The
Figma MCP returned *no access* for this file, so this spec works from the screenshot at
[`screenshots/company-general-info-edit.png`](../screenshots/company-general-info-edit.png).
Icon tracing (§6.6) needs the file shared.

---

## 1. Overview

The **General Info** card on the Settings > **Company** tab already routes to
`/settings/company/general-info`, where it renders a form built earlier on
`feature/edit-company-settings`. That form runs on an in-memory mock and has the wrong
fields (company name, contact email, phone, free-text address, plus PTO / tax-code /
business-unit field arrays).

This feature rebuilds the screen to match the Figma "General Info" design and wires it to
the real API:

- **Load:** `GET /api/v1/company/{companyId}`
- **Save:** `PATCH /api/v1/company/{companyId}`
- **`companyId`:** read from the `/auth/refresh` login response, carried on the session.

Two sections, **Branding / Logo** and **Non-Working Days**, are UI only: rendered to
match the design, with no data binding and no behaviour.

## 2. Problem Statement

- Office managers can't see or change their real company record. Everything on the
  current screen is mock data that resets on reload.
- The screen doesn't match the approved design. Fields the business needs (legal name,
  company code, tax ID, company size, website, time zone, status) are missing, and the
  PTO, tax-code and business-unit sections belong to other Setup cards ("Business Unit",
  "Tax & States").
- Login already returns the user's `companyId`, but `@cms/auth-data-access` drops it
  (Zod strips unknown keys), so no remote can address company-scoped endpoints.

## 3. Goals / Non-Goals

### Goals

1. Render the General Info screen to match the Figma layout: a two-column card with the
   company form on the left and Non-Working Days on the right, and Cancel / Save below.
2. Load the company record from `GET /company/{companyId}` and populate every bound field.
3. Save edits with `PATCH /company/{companyId}`, sending only the fields that changed.
4. Carry `companyId` from the login response through the session to the settings remote.
5. Render Physical and Billing addresses from the GET response, read-only.
6. Retire the mock store and the PTO / tax-code / business-unit sections from this screen
   (files deleted, as decided at intake).

### Non-Goals

- **Non-Working Days:** no CRUD. The table, "+ Add Non-Working Day", row edit/delete and
  pagination are static UI.
- **Branding / Logo:** no upload or remove. The placeholders and buttons are static UI.
- **Address editing:** the Edit buttons on the address cards do nothing this iteration,
  and addresses are never sent in PATCH.
- An unsaved-changes guard on navigation (not in the design).
- Refresh-on-expiry for the access token (a known gap from the login feature).
- Mapping the numeric `tenantId` into the shell's `TENANT_NAMES` lookup (tracked
  separately by the login feature).

## 4. User Stories

1. As an **office manager**, I want to open General Info from the Company tab and see my
   company's real details, so I can check they're correct.
2. As an **office manager**, I want to correct the name, legal name, code, contact details,
   tax ID, company size, time zone or status and press Save, so the change persists for
   everyone in my company.
3. As an **office manager**, I want invalid input (for example a bad email or an empty
   required field) flagged before anything is sent, so I don't save broken data.
4. As an **office manager**, I want a clear message when a save fails (expired session,
   no permission, conflict), so I know whether to retry, sign in again, or escalate.
5. As an **office manager**, I want Cancel to leave without saving, so I can back out
   safely.

## 5. Design Reference

Based on the pasted screenshot of node `75-6519` (1270px wide frame):

**Page header:** "General Info", with the subtitle "Manage your company details, address,
logo and non working days." Keep the existing breadcrumb (Setup › Company › General Info)
above it.

**Main card, left column (about 60%):**

| Section              | Fields (\* = required marker in design)                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Company Information  | Name\*, Legal Name\* · Code\*, Company Number · Company Size (select), Tax ID                   |
| Contact Information  | Email\*, Phone Number\* · Website (full width)                                                  |
| Addresses            | Two cards: **Physical Address**, **Billing Address**. Each has a pin icon, title, `Edit` button, and a multi-line address |
| Branding / Logo      | Two cards: **Full Logo**, **Compact Logo**. Each has a "Logo" placeholder, `↑ Upload / Change`, and a red `Remove` |
| Company Defaults     | Time Zone\* (select, e.g. "(CT) Central Time (America/Chicago)") · Status (switch, "Active")    |

Fields sit in a two-column grid; Website spans both columns.

**Main card, right column (about 40%), separated by a vertical divider:**
"Non-Working Days" with the subtitle "Define company holidays and non working days.", a
"+ Add Non-Working Day" button (soft/outline primary), and a table with columns Date · Day
· Description · Actions (pencil and red trash icons). Six rows: New Year's Day, Memorial
Day, Independence Day, Labor Day, Thanksgiving Day, Christmas Day (2025). Pager shows
`‹ 1 ›`.

**Footer, outside the card, right-aligned:** `Cancel` (surface/outline) and `Save` (primary).

## 6. Functional Requirements

### 6.1 `companyId` from login

- **FR-1** `authUserSchema` in `libs/shared/auth-data-access/src/lib/auth.schema.ts` must
  declare `companyId`, coerced to a string:
  `z.union([z.string(), z.number()]).transform(String)`. **Confirmed:** it is
  `data.user.companyId`, a number (`1` for the dev user), and it is the path key for
  `GET /company/{companyId}`. Note it is *not* the company's `id` (`52`, which equals
  `tenantId`); it matches the company's `companyNumber`.
- **FR-2** `UserDetails` in `libs/platform-contract` gains `readonly companyId?: string`.
  It's optional so existing hosts, stories and the standalone runtimes keep compiling.
  `toUserDetails` in `apps/shell/src/lib/authenticate-with-api.ts` maps it through.
  - Why `UserDetails` and not a new `CmsRuntime` field: the session already persists the
    whole `user` object to `sessionStorage`, and `mfeRuntime.currentUser` already
    delivers it to every remote. So there's no shell store, session or runtime-contract
    change, and `isUserDetails` needs no edit because the field is optional.
- **FR-3** The settings `App.tsx` must pass `runtime.currentUser.companyId` to
  `CompanySettingsPage`, replacing today's `runtime.tenantId`.
- **FR-4** If `companyId` is missing (for example a session stored before this change),
  the page must not issue the GET. It must show an error callout: "Your session isn't
  linked to a company. Sign out and sign in again." Use `enabled: Boolean(companyId)` on
  the query.

### 6.2 Data access (`@cms/settings-data-access`)

- **FR-5** Replace the mock implementation with real calls through `customFetch`. The
  `baseUrl` is already `/api/v1`, so the endpoint strings are `/company/${companyId}`.
  No `fetch`, no `import.meta.env`.
- **FR-6** Keep two schemas separate:
  - `companyResponseSchema`: the **wire DTO** inside the response envelope
    `{ success, statusCode, data }`, which is the envelope `/auth/refresh` uses. It is
    parsed on every GET, and the `customFetch` call is typed `unknown` so the parse, not
    the type argument, establishes the shape, as `refreshAccessToken` does.
  - `companyGeneralInfoFormSchema`: the **form model** with its validation messages (§6.4).
  - Pure mappers `toCompanyGeneralInfo(dto)` and `toCompanyPatch(values, dirtyFields)`
    convert between them. The form never sees DTO key names.
- **FR-7** DTO, **confirmed** from a real `GET /company/1` response. The envelope is
  `{ success, statusCode, data, errors: [] }`:

  ```ts
  CompanyDto {
    id: number;                    // 52, equals tenantId; not the path key
    tenantId: number;
    companyNumber: number;         // 1, equals login companyId
    companyGuid: string;
    code: string;                  // generated slug, e.g. "acme-field-services-ae23b1"
    name: string;
    legalName: string;
    email: string;
    phoneNumber: string;           // digits incl. country code, e.g. "15551234567"
    website: string | null;        // e.g. "https://acme.example.com"
    taxId: string | null;
    companySize: string | null;    // e.g. "11-50"
    timeZone: string;              // IANA id, e.g. "America/Chicago"
    isActive: boolean;
    physicalAddress: AddressDto | null;
    billingAddress: AddressDto | null;
  }
  AddressDto {
    id; addressLine1; addressLine2..4 (nullable); city; state; county (nullable);
    country;                       // ISO code, e.g. "US"
    postalCode; formattedAddress; latitude; longitude; placeId; isActive;
  }
  ```

  The schema is lenient: display strings are `.nullish()`, so one missing field doesn't
  blank the whole screen. Required-ness is enforced by the form schema instead. Nullable
  values map to `''` in the form model so inputs stay controlled. A redacted copy of the
  response is committed as the test fixture.
- **FR-8** `loadCompanySettings(companyId, { signal })` must forward `signal` to
  `customFetch` so TanStack Query can cancel a GET when the user navigates away.
- **FR-9** `saveCompanySettings(companyId, patch)` sends `PATCH` with a JSON body holding
  **only dirty, editable fields**, mapped to DTO keys. It must never send `companyId`,
  `code`, `companyNumber`, addresses, logos or non-working days.
- **FR-10** Keep the existing injection seam: `LoadCompanySettings` / `SaveCompanySettings`
  types, and the `loadCompanySettings` / `saveCompanySettings` props on `App` and
  `CompanySettingsPage`. That's what lets Storybook run with no network.
- **FR-11** Keep `companySettingsKeys.detail(companyId)` and
  `companySettingsQueryOptions`, including `staleTime` and `meta`.

### 6.3 Screen behaviour

- **FR-12** Opening the General Info card (Settings › Company tab) navigates to
  `/settings/company/general-info`. This already works; don't change it.
- **FR-13** While the GET is pending, show a loading state in the card area. Prefer
  `Skeleton` blocks shaped like the two columns over today's "Loading…" text.
- **FR-14** On success, populate every bound field from the response. The Status switch
  reflects `isActive`, and its label reads "Active" or "Inactive".
- **FR-15** Addresses render from `physicalAddress` / `billingAddress` as in the design:
  line1, line2 (only if present), "City, State PostalCode", then country. A missing
  address shows "No address on file". The `Edit` buttons render but do nothing.
- **FR-16** **Save** is disabled until the form is dirty, and while a save is in flight
  it shows loading text ("Saving…"). Submitting runs Zod validation first. Invalid
  fields show inline errors, focus moves to the first invalid field, and nothing is sent.
- **FR-17** On a successful PATCH, invalidate `companySettingsKeys.detail(companyId)` so
  the form re-seeds from the server. The existing `values:` binding on `useForm` resets
  the dirty state automatically. Also show a success callout: "Company details updated".
  Don't depend on the PATCH response body (OQ-3).
- **FR-18** **Cancel** navigates back to the Setup page (`../..`) without saving. It is
  disabled while a save is in flight.
- **FR-19** Below the `lg` breakpoint, Non-Working Days stacks under the form, and the
  form's two-column grids collapse to one column below `sm`.

### 6.4 Validation (form model)

| Field          | Rule                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| Name           | required, trimmed, ≤ 150 chars                                            |
| Legal Name     | required, trimmed, ≤ 150 chars                                            |
| Code           | **read-only** (disabled input, never PATCHed; decided after seeing the generated slug) |
| Company Number | **read-only** (disabled input, never PATCHed; it's the path key)          |
| Company Size   | optional, one of `COMPANY_SIZE_OPTIONS` (`"11-50"` style values)          |
| Tax ID         | optional, ≤ 50 chars                                                      |
| Email          | required, valid email                                                     |
| Phone Number   | required, 10–15 digits once non-digits are stripped. Displayed formatted (`+1 (555) 123-4567`); sent as digits-only with a leading `1` added to a bare 10-digit number, matching the API's `15551234567` |
| Website        | optional; accepts a bare host (`www.abchvac.com`) or an `http(s)://` URL  |
| Time Zone      | required, one of `TIME_ZONE_OPTIONS`                                      |
| Status         | boolean                                                                   |

Validate in `onBlur` mode, as the current form does. Length limits are assumptions (OQ-5).
Server-side 400 errors are surfaced as in §7.

### 6.5 UI-only sections

- **FR-20** **Branding / Logo:** two static cards matching the design, each with a
  "Logo" placeholder, `Upload / Change`, and `Remove`. No file input and no handlers.
  Buttons carry `type="button"` so they can't submit the form.
- **FR-21** **Non-Working Days:** header, subtitle, and "+ Add Non-Working Day"; a
  `DataTable` (or `Table`) of the six design rows from a `constants/` mock
  (`NON_WORKING_DAYS_PREVIEW`); inert edit/delete icon buttons with accessible labels
  ("Edit New Year's Day", "Delete New Year's Day"); and a static pager.
- **FR-22** Neither section reads from or writes to the API, and neither affects the
  form's dirty state.

### 6.6 Component and file plan

`apps/settings/src/` (per the Application Internal Structure rules):

| File                                                  | Change                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| `App.tsx`                                             | pass `runtime.currentUser.companyId` (FR-3)                        |
| `pages/CompanySettingsPage.tsx`                       | new header copy, missing-`companyId` state, invalidate on success |
| `components/CompanySettingsForm.tsx`                  | rebuilt to the Figma layout; composes the sections below          |
| `components/general-info/CompanyInformationSection.tsx` | new                                                             |
| `components/general-info/ContactInformationSection.tsx` | new                                                             |
| `components/general-info/AddressesSection.tsx`        | new, read-only address cards                                     |
| `components/general-info/BrandingSection.tsx`         | new, UI only                                                     |
| `components/general-info/CompanyDefaultsSection.tsx`  | new, time zone select and status switch                          |
| `components/general-info/NonWorkingDaysPanel.tsx`     | new, UI only                                                     |
| `constants/company-options.ts`                        | `COMPANY_SIZE_OPTIONS`, `TIME_ZONE_OPTIONS` (literal data)        |
| `constants/non-working-days.ts`                       | `NON_WORKING_DAYS_PREVIEW`                                        |
| `lib/format-address.ts`                               | pure address-to-lines formatter                                   |
| `components/sections/*FieldArray.tsx` (×3)            | **delete**                                                        |

`libs/settings/data-access/src/lib/`:

| File                                        | Change                                                  |
| ------------------------------------------- | ------------------------------------------------------- |
| `schemas/company-settings.schema.ts`        | rewritten: DTO schema, form schema, types               |
| `mappers/company-settings.mappers.ts`       | new: `toCompanyGeneralInfo`, `toCompanyPatch`            |
| `queries/company-settings.queries.ts`       | real GET via `customFetch`                              |
| `mutations/company-settings.mutations.ts`   | real PATCH via `customFetch`                            |
| `mocks/company-settings.mock.ts`            | **delete** (in-memory store)                            |
| `company-settings.queries.ts`, `company-settings.schema.ts` (lib root) | **delete**, orphaned duplicates not exported from `index.ts` |
| `index.ts`                                  | drop mock exports; export mappers and new types          |

The lib must also declare `@cms/shared-api` as a `workspace:*` dependency if it doesn't
already. Phase 4 of the monorepo remediation was bitten by exactly this omission.

Other files:

- `libs/shared/auth-data-access/src/lib/auth.schema.ts` and `README.md`: add `companyId`
  and update the "dropped keys" list.
- `libs/platform-contract`: `UserDetails.companyId?`.
- `apps/shell/src/lib/authenticate-with-api.ts`: map `companyId`.
- `apps/settings/src/standalone-runtime.ts`: give `standaloneUser` a `companyId` (read
  from `VITE_DEV_COMPANY_ID`, falling back to a fixture) and add `getAuthToken`, so the
  standalone dev server can call the API. This closes a follow-up recorded by the login
  feature for this remote.
- `.storybook/fixtures/feature-data.ts`: replace `companySettingsFixture` with a
  General Info fixture shaped like the new form model.

**UI components** (`@cms/ui`, all present): `SectionCard`, `TextInput`, `PhoneInput`,
`SelectField`, `SwitchField`, `Button`, `IconButton`, `DataTable`/`Table`, `Callout`,
`Skeleton`, `Breadcrumb`, `Heading1`, `BodySmall`.

**Icons** (`libs/ui/src/icons`): present are `location-pin`, `edit`, `trash`, `plus`,
`chevron-left`/`-right`, and `chevron-down`. The **upload arrow** for "Upload / Change"
has no confirmed match (`export-icon` may or may not be the same glyph). Trace it from
Figma per the coding standards once file access is granted. Don't pull in an icon package.

## 7. Edge Cases & Error States

| Case                                        | Behaviour                                                                  |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| `companyId` absent from session             | No GET; error callout asking the user to sign in again (FR-4)               |
| GET 401                                     | Callout: "Your session has expired. Sign in again."                        |
| GET 403                                     | Callout: "You don't have access to this company's settings."               |
| GET 404                                     | Callout: "Company not found."                                              |
| GET response fails Zod parse                | Callout: "Company details came back in an unexpected format." The parse error is logged by `logCmsQueryError`, not shown |
| Network failure or CORS                     | Callout with a generic unreachable message                                 |
| PATCH 400 with `message`                    | Error callout shows the API `message`; form values are kept                 |
| PATCH 401 / 403                             | As for GET, but form values are kept so nothing typed is lost               |
| PATCH 409                                   | Keep the existing message: "Settings already updated by another user"       |
| Save with no changes                        | Not possible, because Save is disabled when the form isn't dirty            |
| Double-click Save                           | Only one PATCH; the button is disabled while pending                        |
| Navigate away mid-GET                       | Request aborted through `signal`                                           |
| Nullable DTO fields                         | Mapped to `''`; mapped back to `null` in PATCH only if the user cleared them |
| Unknown `companySize` / `timeZone` from API | Show the raw value as a selectable option rather than a blank select        |
| Toggle Status off                           | Sent as `isActive: false` on Save (see OQ-6)                               |

Errors surface through TanStack Query's `isError`/`error`, narrowed with
`instanceof ApiError`. Nothing swallows them into a result object. The coding standards
prefer a toast, but the workspace has no toast component yet, so this keeps the existing
`Callout` pattern (OQ-7).

## 8. Success Metrics

- On a real login, the screen shows the API's values for every bound field. Verified in
  the browser against the dev API through the shell proxy.
- Editing one field and saving sends a PATCH containing only that field, visible in the
  DevTools Network tab. A reload shows the new value.
- `lint`, `typecheck`, `test:query` and `build` are clean. `storybook:test` shows no new
  failures against the baseline (227/237 at `147e29f`; the three pre-existing
  `settings/App.stories.tsx` failures should be fixed or re-baselined, since this rewrite
  touches that file).
- Stories cover Loaded, Loading, Load error, Missing companyId, Validation error
  (`play`: clear Name, blur, assert the message), Save success (`play`: edit, Save,
  assert the save spy got a dirty-only patch), and Save 409.

## 9. Open Questions / Assumptions

| #    | Question                                                                                                              | Assumption used in this spec                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| OQ-1 | Where is `companyId` in the `/auth/refresh` response: `data.user.companyId` or `data.companyId`? String or number?     | **Resolved:** `data.user.companyId`, number `1`; it's the path key |
| OQ-2 | Exact GET `/company/{id}` response shape and field names.                                                             | **Resolved:** real response captured; FR-7 updated             |
| OQ-3 | Does PATCH return the updated company? What does its error body look like (per-field errors)?                         | Response body ignored; query invalidated. Only top-level `message` is shown |
| OQ-4 | Company Size and Time Zone: fixed enums or lookup endpoints? What are the wire values?                                 | Static constants: sizes `1–10`, `11–50`, `51–200`, `201–500`, `501–1000`, `1000+`; US time zones (ET, CT, MT, AZ, PT, AK, HT) keyed by IANA id |
| OQ-5 | Length and format limits (code pattern, tax ID format, phone format stored).                                          | Limits in §6.4; phone kept in the format the API returns      |
| OQ-6 | Should an admin be able to set their own company to Inactive from here? That could lock everyone out.                   | Editable as designed; worth a confirm dialog if the answer is "yes, but carefully" |
| OQ-7 | Toast vs `Callout` for save feedback? The coding standards say toast, but none exists.                                  | `Callout`, matching the current page                          |
| OQ-8 | Should the inert controls (address Edit, logo buttons, Add Non-Working Day, row actions) look disabled or look live?     | Rendered as in the design, no handlers                        |
| OQ-9 | Required-field rules come from the design's asterisks. Does the API enforce the same set?                               | Yes                                                           |
| OQ-10 | Does the API need the `Authorization` bearer only, or also a tenant header?                                          | **Resolved in browser testing:** it also needs `X-Tenant-Id` (login's `user.tenantId`, `52`), otherwise `400 "Tenant context is required"`. Sent globally from `customFetch` via `getTenantId` |
