# Company Branding — reusable entity image upload

**Status:** Spec + plan; API wiring in implementation. **Branch:** continue
`feature/company-general-info-settings-implementation` (branding is on General Info).

**Design:** pasted screenshot of the existing General Info **Branding / Logo** section
(Full Logo + Compact Logo cards). Durable copy:
[`screenshots/company-branding-logo.png`](../screenshots/company-branding-logo.png).
No Figma file was provided this pass.

**First consumer:** Settings › Company › General Info (`BrandingSection`). The upload
control itself is a shared `@cms/ui` module so any remote can drop it in with a different
`entityType` / `entityId` / `slot` and no fork of the component.

---

## 1. Overview

General Info already renders two Branding / Logo cards that match the design, but
**Upload / Change** and **Remove** do nothing, and the preview never shows a file.

This feature makes those cards work in the browser — pick an image, preview it, replace
it, remove it — without calling the File Service. The same control is parameterized by
**entity identity** (`entityType`, `entityId`) plus a **slot** (which image on that
entity), so a later work-order photo, technician avatar, or invoice logo reuses the
module by changing props, not by copying JSX.

Company branding this pass is hard-wired to:

| Prop          | Value          |
| ------------- | -------------- |
| `entityType`  | `"company"`    |
| `entityId`    | `"1"`          |
| Full Logo     | `slot: "full-logo"`     |
| Compact Logo  | `slot: "compact-logo"`  |

Reads, writes, and deletes go through a **pluggable store**. `@cms/ui` ships a memory
store for Storybook. Settings General Info passes `createAttachmentEntityImageStore()`
from `@cms/shared-data-access`, which calls existing File Service factories
(`GET /attachment`, `POST /attachment`, `DELETE /attachment/{id}`, download blob).
The UI module does not import `customFetch`, TanStack Query, or attachment DTOs.

## 2. Problem Statement

- Office managers see live-looking Upload / Change and Remove buttons that do nothing.
- The next place that needs an image (work order photo, user avatar, invoice branding)
  would otherwise copy the Branding cards and drift.
- File Service factories already exist in `@cms/shared-data-access`, but wiring them now
  would couple the first screen to network, auth, and MSW before the interaction model is
  proven. This pass proves the UI and the reuse seam.

## 3. Goals / Non-Goals

### Goals

1. Ship a reusable `@cms/ui` **entity image upload** module: empty preview, file pick,
   change, preview, remove, client-side validation, and “get what this entity already
   has” on mount.
2. Parameterize every instance by `entityType`, `entityId`, and `slot`. Optional
   `category` / `logoVariant` ride along on the identity object so an API store can use
   them later without a component API break.
3. Default Storybook persistence is a memory store keyed by
   `${entityType}:${entityId}:${slot}`. Full Logo and Compact Logo are independent.
4. Wire **Branding / Logo** on General Info to two instances with
   `entityType="company"` and `entityId="1"`, using the File Service attachment store.
5. Keep logo changes off the company PATCH / Save footer. Upload and remove happen on
   the card, immediately in the store. They must not dirty `CompanySettingsForm`.
6. Storybook covers empty, preview, change, remove, validation, independent slots, and a
   custom store (proves the adapter).

### Non-Goals

- New swagger fields, a second DTO, or a new endpoint. Use the existing `/attachment`
  factories. Do not add `@cms/shared-data-access` or `@cms/shared-api` as a dependency of
  `@cms/ui`.
- Crop, rotate, drag-and-drop, multi-file, PDF/non-image types, progress bars, and a
  delete confirmation dialog (the screenshot has none).
- Binding `entityId` to the signed-in `user.companyId`. This pass uses `"1"` as specified.
- Changing company Save / Cancel, addresses, or Non-Working Days.
- A new upload-arrow icon. The provided screenshot is text-only on Upload / Change;
  Remove keeps the existing `TrashIcon`.

## 4. User Stories

1. As an **office manager**, I want to upload a full logo and see it in the card, so I
   know which mark will represent the company.
2. As an **office manager**, I want to change that logo without removing it first, so
   replacing a file is one click.
3. As an **office manager**, I want to remove a logo and get the empty “Logo”
   placeholder back, so a bad file is not stuck on the card.
4. As an **office manager**, I want a compact logo that is independent of the full logo,
   so each mark can be set, changed, or cleared on its own.
5. As an **office manager**, I want an invalid file (wrong type or too large) rejected
   with a message on that card, so I know what to pick instead.
6. As a **developer adding an image on another entity**, I want to mount the same module
   with a different `entityType` / `entityId` / `slot` (and later a different store), so
   I do not copy Branding markup.

## 5. Design Reference

From [`screenshots/company-branding-logo.png`](../screenshots/company-branding-logo.png):

**Section title:** “Branding / Logo”.

**Layout:** two equal cards in a row (existing `FormSection` `sm:grid-cols-2` grid).
Each card:

| Element            | Treatment                                                                 |
| ------------------ | ------------------------------------------------------------------------- |
| Title              | “Full Logo” / “Compact Logo”                                              |
| Preview            | Light sunken rounded rectangle, centered muted “Logo” when empty          |
| Upload / Change    | Full-width surface button, label only (no leading icon in this screenshot) |
| Remove             | Full-width surface button, red text, `TrashIcon` + “Remove”               |

Cards use the existing General Info chrome (`rounded-lg border border-border-subtle p-4`,
preview `h-20 … bg-surface-sunken`). Do not invent a second card language.

When a file is present, the preview shows the image (`object-contain`) instead of the
“Logo” label. Filename is not in the screenshot; do not add a caption unless needed for
an accessible `alt`.

## 6. Functional Requirements

### 6.1 Reusable module (the reuse seam)

- **FR-1** Add `EntityImageUpload` to `@cms/ui` (`libs/ui/src/components/ui/entity-image-upload/`).
  Hand-author it: there is no shadcn registry equivalent (in-file comment). Record it in
  the provenance table as bespoke. Export from the `@cms/ui` barrel so remotes import
  `import { EntityImageUpload } from '@cms/ui'` — same as `Button`. Split store I/O into
  a colocated kebab-case hook (`use-entity-image-upload.ts`); the `.tsx` only renders.
  Components, the hook, and handlers are `const` arrows, not `function` declarations.
- **FR-2** Required props: `entityType: string`, `entityId: string`, `slot: string`.
  Optional: `title`, `emptyLabel` (default `"Logo"`), `accept`, `maxSizeBytes`,
  `disabled`, `store`, `category`, `logoVariant`, `onChange`.
- **FR-3** Identity passed to the store is:

  ```ts
  type EntityImageRef = {
    entityType: string;
    entityId: string;
    slot: string;
    category?: string;
    logoVariant?: string;
  };
  ```

  The memory store keys **only** on `entityType + entityId + slot`. `category` and
  `logoVariant` are ignored by the default store and reserved for an API store.
- **FR-4** Persistence is a `EntityImageStore`:

  ```ts
  type EntityImageValue = {
    fileName: string;
    contentType: string;
    previewUrl: string;
    sizeBytes: number;
    file?: File;
  };

  type EntityImageStore = {
    get(ref: EntityImageRef): Promise<EntityImageValue | null>;
    put(ref: EntityImageRef, file: File): Promise<EntityImageValue>;
    remove(ref: EntityImageRef): Promise<void>;
  };
  ```

  Default in `@cms/ui`: exported `createMemoryEntityImageStore()` (and a module
  singleton `memoryEntityImageStore` so remounting the same identity still **gets**
  the file in Storybook). The component must not fetch or know about `/attachment`.
- **FR-5** `@cms/shared-data-access` exports `createAttachmentEntityImageStore()` that
  implements the same `get` / `put` / `remove` shape (structural typing — data-access
  does not import `@cms/ui`):

  | UI prop                    | File Service                                      |
  | -------------------------- | ------------------------------------------------- |
  | `entityType` `"company"`   | list/create `entityType` (exact string)           |
  | `entityId` `"1"`           | number `1`                                        |
  | `category` (default `slot`)| list/create `category` — unique per card          |
  | `logoVariant`              | create multipart field only                       |

  **Get:** `GET /attachment?entityType&entityId&category`, then download the latest
  item’s bytes (`GET /attachment/{entityType}/{id}`) into an object URL (img `src`
  cannot send the bearer token).
  **Put (upload or change):** `POST /attachment` multipart; if a row already exists
  for that category, `DELETE /attachment/{id}` the previous id after a successful
  create.
  **Remove:** list, then `DELETE /attachment/{id}`.

  Branding this pass: `store={createAttachmentEntityImageStore()}`. Another screen
  reuses the module by changing `entityType` / `entityId` / `slot` / `category`.

- **FR-6** `@cms/ui` must not import `@cms/shared-data-access`, `@cms/shared-contract`,
  or `@cms/shared-api`. The store interface is declared next to the component.

### 6.2 Get the uploaded file

- **FR-7** On mount (and when `entityType` / `entityId` / `slot` change), the component
  calls `store.get(ref)`. If a value is returned, the preview shows that image. If
  `null`, it shows `emptyLabel`.
- **FR-8** While `get` is in flight, the preview stays in the empty visual (no extra
  spinner this pass — memory get is sync-in-async). `aria-busy` is set if the store
  takes a tick. A failed `get` shows a short inline error on that card and leaves the
  empty placeholder.

### 6.3 Upload / Change

- **FR-9** **Upload / Change** opens the OS file picker via a visually hidden
  `<input type="file">`. `accept` defaults to
  `image/png,image/jpeg,image/webp,image/svg+xml`. The input value is cleared after each
  change so picking the same file again still fires.
- **FR-10** On a valid file: `store.put(ref, file)`, replace the preview with
  `previewUrl`, and call `onChange(value)` if provided. Object URLs from a replaced file
  are revoked by the **store**, not by the card, so a remount can still `get` the current
  preview.
- **FR-11** Client-side rejection (do not call `put`):
  - type not in the `accept` list
  - `file.size > maxSizeBytes` (default **2 × 1024 × 1024**)
  Message is inline under the buttons on that card only (other slot unaffected). Copy:
  - type: “Use a PNG, JPEG, WEBP, or SVG image.”
  - size: “Image must be 2 MB or smaller.”
- **FR-12** Named **arrow** handlers only (no inline function bodies in JSX), matching
  `.cursor/rules/named-event-handlers.mdc`. `const handleFileChange = (event) => { … }`,
  not `function handleFileChange`.

### 6.4 Delete

- **FR-13** **Remove** calls `store.remove(ref)`, restores `emptyLabel`, and calls
  `onChange(null)`. No confirmation dialog.
- **FR-14** Remove is **disabled** when the slot is empty (assumption; the screenshot
  shows the button in both states but enabling a no-op is worse UX). Upload / Change
  stays enabled unless `disabled` is set on the component.

### 6.5 Company branding consumer

- **FR-15** `BrandingSection` renders two `EntityImageUpload` instances. It does not
  reimplement preview/buttons. Values this pass:

  | Card          | `entityType` | `entityId` | `slot`          | `category`     | `logoVariant` |
  | ------------- | ------------ | ---------- | --------------- | -------------- | ------------- |
  | Full Logo     | `"company"`  | `"1"`      | `"full-logo"`   | `"full-logo"`  | `"full"`      |
  | Compact Logo  | `"company"`  | `"1"`      | `"compact-logo"`| `"compact-logo"` | `"compact"` |

  `title` matches the card titles. Slot **data** lives in
  `constant/company-branding.ts`; the slot **type** lives in
  `types/company-branding.types.ts` (page `types/` rule — no `export interface` in a
  `.tsx` or in `constant/`). `BrandingSection` stays a prop-less `const` arrow and
  maps that constant. A future “use session `companyId`” change is one constant.
- **FR-16** Logo actions must not set React Hook Form dirty state and must not be
  included in `toCompanyPatch`. Cancel / Save behaviour is unchanged.
- **FR-17** Full and Compact must not share a preview. Putting a file in one slot leaves
  the other empty (or whatever it already had).

### 6.6 Accessibility

- **FR-18** Each control has a unique accessible name including the slot title
  (`Upload / Change Full Logo`, `Remove Compact Logo`). The file input is labelled by
  the same name (or `aria-labelledby` the button).
- **FR-19** Preview `<img>` `alt` is the slot title when a file is present; the empty
  state is the text “Logo”, not an empty image.
- **FR-20** Inline validation uses `role="alert"`. Contrast on the empty placeholder
  stays on `surface-sunken` / `foreground-muted` (already fixed for a11y on this screen).

## 7. Edge Cases & Error States

| Case                                      | Behaviour                                                      |
| ----------------------------------------- | -------------------------------------------------------------- |
| User cancels the file picker              | No store call, no error, preview unchanged                     |
| Same file picked again                    | Input reset (FR-9) so `change` fires; `put` replaces           |
| Invalid type or oversize                  | FR-11 message; previous valid preview kept                     |
| `get` / `put` / `remove` throws           | Inline error on that card; previous preview kept on put fail   |
| Rapid double-click Upload                 | One picker; ignore while an input is already open              |
| Unmount during in-flight store call       | Ignore the result (cancelled flag); do not setState            |
| Two mounts of the same identity           | Same memory singleton; both `get` the same value               |
| Page reload                               | Memory store empty (session only)                              |
| `disabled`                                | Both buttons disabled; file input not openable                 |
| Narrow viewport                           | Cards stack (`grid-cols-1`); buttons remain full width         |

## 8. Success Metrics

- An office manager can set, replace, and clear Full Logo and Compact Logo independently
  on General Info without using Save.
- A second screen can mount `EntityImageUpload` with another `entityType` / `entityId` /
  `slot` and get the same behaviour with no edits inside the module.
- Storybook interaction tests cover get (pre-seeded store), put, change, remove, and
  validation. `storybook:test` a11y checks pass on the new stories.
- Branding buttons produce `/attachment` list, create, download, and delete calls — not
  company PATCH. Save stays dirty only for company fields.

## 9. Open Questions / Assumptions

| ID   | Question                                                                 | Default this spec uses                                      |
| ---- | ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| OQ-1 | Confirm vs immediate Remove?                                             | Immediate (no dialog). Screenshot has none.                 |
| OQ-2 | Max size and allowed types?                                              | 2 MB; PNG/JPEG/WEBP/SVG.                                    |
| OQ-3 | Should `entityId` come from session `companyId`?                         | No this pass — always `"1"` as requested.                   |
| OQ-4 | File Service examples use `Company` not `"company"`.                     | Send `"company"` as specified. Distinct category per slot.  |
| OQ-5 | Show filename under the preview?                                         | No — not in the screenshot. `alt` is enough.                |
| OQ-6 | Drag-and-drop onto the preview?                                          | Out of scope.                                               |
| OQ-7 | Should Remove stay enabled when empty (pixel match)?                     | Disabled when empty (FR-14).                                |
| OQ-8 | Persist memory store across MFE remounts in the shell?                   | Yes, module singleton in `@cms/ui` (MF shared singleton).   |

## 10. File map (proposed)

| Layer        | Path                                                                 |
| ------------ | -------------------------------------------------------------------- |
| UI module    | `libs/ui/src/components/ui/entity-image-upload/` (memory store, types, hook, tsx, stories) |
| Stories      | `…/entity-image-upload/entity-image-upload.stories.tsx`              |
| UI barrel    | `libs/ui/src/components/ui/index.ts`, provenance in `libs/ui/README.md` |
| API store    | `libs/shared/data-access/src/lib/attachment/attachment.entity-image.ts` |
| MSW bytes    | `libs/shared/mocks/src/handlers/attachment.ts`                       |
| Branding     | `apps/settings/src/pages/CompanySettingsPage/component/general-info/BrandingSection.tsx` |
| Slot data    | `apps/settings/src/pages/CompanySettingsPage/constant/company-branding.ts` |
| Slot type    | `apps/settings/src/pages/CompanySettingsPage/types/company-branding.types.ts` |
| Screenshot   | `.claude/context/screenshots/company-branding-logo.png`              |

No wire DTO in page `types/`. No new swagger resource. Reuse `@cms/shared-contract`
attachment schemas.

## 11. Verification

- `pnpm exec nx lint ui settings`
- `pnpm exec nx typecheck ui settings` (or `tsc --noEmit` if Nx reports no tasks)
- `pnpm run storybook:test` — new `EntityImageUpload` stories plus existing General Info
  stories still pass
- Browser: General Info Branding — empty → upload → preview → change → remove, both
  slots independent, invalid file message, Save still only dirty for company fields
