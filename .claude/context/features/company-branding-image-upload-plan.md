# Implementation Plan — Company Branding entity image upload (UI only)

**Source spec:** [company-branding-image-upload-prd.md](company-branding-image-upload-prd.md)
**Branch (proposed):** `feature/company-branding-image-upload`

**Codebase context:** Nx + Vite Module Federation. Presentational primitives live in
`@cms/ui` (`libs/ui`, tag `scope:shared`), imported through the barrel, shared as an MF
singleton. `@cms/ui` has **no network or app-state logic** (no `customFetch`, TanStack
Query, or page stores); a local object-URL memory adapter is still presentational.
Settings General Info is page-owned under
`apps/settings/src/pages/CompanySettingsPage/`; `BrandingSection` is already a `const`
arrow with inert buttons. File Service factories already exist in
`@cms/shared-data-access` (`libs/shared/data-access/src/lib/attachment/`) — **do not
import them this pass.** Forms stay on React Hook Form; logo actions must not touch
`dirtyFields`.

**Coding style (updated after the spec):** match `coding-standards.md` /
`.cursor/rules/named-event-handlers.mdc` / `.cursor/rules/page-folder-structure.mdc` as
they stand now. Non-Working Days (`component/general-info/non-working-day/`) is the
settings reference: `const` arrows, named-arrow handlers, props in `types/`, data in
`constant/`, store I/O in a colocated kebab-case `use-*.ts` hook. These are file-shape
rules — they do not move the module out of `@cms/ui` or add API work.

## Resolved Assumptions

- **UI only:** default `memoryEntityImageStore`; no `/attachment` calls, no MSW changes,
  no contract/DTO work (PRD Non-Goals, FR-4–FR-6).
- **Identity this pass:** `entityType: "company"`, `entityId: "1"` (PRD table, OQ-3).
  Session `companyId` is not read.
- **Slots:** `full-logo` / `compact-logo`, with passthrough `category: "logo"` and
  `logoVariant: "full" | "compact"` for a future adapter (FR-3, FR-15).
- **Remove:** disabled when empty; no confirm dialog (OQ-1, OQ-7, FR-14).
- **Validation:** PNG/JPEG/WEBP/SVG, 2 MB (OQ-2, FR-11).
- **Upload / Change:** text-only, existing `TrashIcon` on Remove (Non-Goals).
- **Store lifecycle:** module singleton so a remount `get`s the current file (OQ-8).
  Reload clears it.
- **Company Save:** unchanged; logos are not in `companyGeneralInfoFormSchema` (FR-16).
- **Arrows, not `function`:** components, handlers, store factories, and page-owned utils
  are `const` arrows (`export const EntityImageUpload = (…) =>`,
  `const handleUploadClick = () => { … }`). Same rule as BrandingSection / NWD.
- **Hook vs markup:** `use-entity-image-upload.ts` owns get/put/remove, validation, and
  preview state. The `.tsx` only renders. Keep each under ~50 lines; no `renderX()`
  helpers.
- **Page types vs constants:** slot **data** in `constant/company-branding.ts`; the slot
  **type** in `types/company-branding.types.ts` (re-export from `types/index.ts`). Do not
  declare `export interface` in a `.tsx` or in `constant/`. `BrandingSection` stays
  prop-less. `@cms/ui` may still colocate its public types next to the component (the
  page `types/` rule is `apps/**` only).

## Task Breakdown

| # | Task | Maps to Requirement(s) | File(s) | Depends On |
|---|------|------------------------|---------|------------|
| 1 | **Store contract + memory implementation.** `EntityImageRef`, `EntityImageValue`, `EntityImageStore` as `export type` / `export interface` in the ui module (not a page `types/` file). `createMemoryEntityImageStore` as a `const` arrow, keyed by `entityType:entityId:slot`. `put` creates `URL.createObjectURL`, revokes the previous URL for that key, returns metadata + `file`. `get` returns the current value or `null`. `remove` revokes and deletes. Export a process-wide `memoryEntityImageStore` singleton. No network. | FR-3, FR-4, FR-6, FR-10 | `libs/ui/src/components/ui/entity-image-upload/entity-image-store.ts`, `…/entity-image-upload.types.ts` | — |
| 2 | **Hook + presentational card.** `use-entity-image-upload.ts` (kebab-case) owns mount `get`, validate, `put` / `remove`, error, `disabled` / empty-Remove, and a cancelled-unmount flag. `entity-image-upload.tsx` is `export const EntityImageUpload = (…) =>` and only renders title, preview, hidden file input, Upload / Change, Remove + `TrashIcon`. Named **arrow** handlers in the component body (`handleUploadClick`, `handleFileChange`, `handleRemove`). Revoke stays the store’s job. In-file comment: no shadcn FileUpload equivalent. | FR-1, FR-2, FR-7 – FR-14, FR-18 – FR-20, §7 | `…/use-entity-image-upload.ts`, `…/entity-image-upload.tsx`, `…/index.ts` | Task 1 |
| 3 | **Export and provenance.** Re-export from the `@cms/ui` barrel. Add a provenance row under “(c) Bespoke FieldPro” explaining there is no registry `FileUpload` we want, and this component is entity-keyed rather than a generic dropzone. | FR-1 | `libs/ui/src/components/ui/index.ts`, `libs/ui/README.md` | Task 2 |
| 4 | **Storybook.** Colocate autodocs stories (already the ui pattern). `play` functions: Empty; SeededGet (pre-`put` on a unique identity, assert img); Upload (userEvent upload, assert preview); Change; Remove (preview gone, Remove disabled); InvalidType / Oversize (alert copy, previous preview kept); IndependentSlots (two instances, same `entityType`/`entityId`, different `slot`); CustomStore (`fn()` adapter, assert `get`/`put`/`remove` called with the ref). Use distinct `entityId`s per story so the singleton does not leak. | FR-4, FR-7, FR-9 – FR-14, FR-17, §8 | `libs/ui/src/components/ui/entity-image-upload/entity-image-upload.stories.tsx` | Task 2 |
| 5 | **Company identity + BrandingSection.** Slot **type** in page `types/` (`CompanyBrandingSlot`). Slot **data** (`entityType: 'company'`, `entityId: '1'`, slot/category/logoVariant) in `constant/company-branding.ts`. `BrandingSection` stays a prop-less `const` arrow, maps the constant to `EntityImageUpload`, imports folders through barrels (`from '../../constant'`, `from '@cms/ui'`). No `renderSlot()`. Do not nest a `branding/` folder — two cards is not a grown panel. | FR-15, FR-16, FR-17 | `apps/settings/src/pages/CompanySettingsPage/types/company-branding.types.ts`, `…/types/index.ts`, `…/constant/company-branding.ts`, `…/constant/index.ts`, `…/component/general-info/BrandingSection.tsx` | Task 3 |
| 6 | **Verify.** `nx lint/typecheck` for `ui` and `settings`. `pnpm run storybook:test` (new stories + existing Settings General Info). Browser on `/settings/company/general-info`: both cards empty → upload each → independent previews → change one → remove one → invalid file on the other → Save still disabled until a company field is edited; no `/attachment` in Network. | §8, §11 | — | Tasks 1–5 |
| 7 | **Docs.** Status in `current-feature.md` after implementation (not before). Do not silently patch this plan if a requirement was skipped — flag it. | workflow | `.claude/context/current-feature.md` | Task 6 |

**Suggested commits** (each only after you approve; none yet):

1. `feat(ui)`: `EntityImageUpload` + memory store + stories (Tasks 1–4).
2. `feat(settings)`: Branding section consumes the module (Task 5).
3. `docs`: mark current-feature complete after Task 6.

## Out of Scope This Pass

- File Service adapter (`createAttachment` / list / download / delete), swagger casing
  map `"company"` → `Company`, and MSW.
- Binding `entityId` to `user.companyId`.
- Crop, drag-and-drop, confirm-on-remove, filename caption, new upload icon.
- Company PATCH, addresses, Non-Working Days.

## Notes for Review

- **Reuse is the store + identity props, not a settings-only hook.** Putting this in
  `pages/CompanySettingsPage/` would force the next consumer to copy the card. Putting
  fetch inside `@cms/ui` would make every remote pull attachment code. The adapter is
  the intended second PR.
- **`entityId` is a string on the UI.** The File Service DTO uses `number`. The future
  adapter parses it; the component stays stringly-keyed so non-numeric entities (if any)
  do not require a later API change.
- **Module Federation:** `@cms/ui` is already a singleton. The memory store module must
  be imported through that barrel (not a `@cms/ui/components/...` deep import from apps)
  so two remotes sharing the same identity actually share the Map.
- **No `test:query` work.** Nothing new goes through `customFetch`.
- **Do not run `pnpm run format`** on the whole checkout (CRLF rewrite). Format only
  touched files if needed.
- **Style delta vs the first draft of this plan:** not a scope change. Still one
  `@cms/ui` module + two Branding cards. What changed is arrows, a colocated hook, and
  putting the slot type in page `types/` instead of beside the constant. Existing
  `@cms/ui` files (e.g. `SettingCard`) still use `function` and in-file props — **new**
  code follows the arrow/hook rules; do not drive-by migrate SettingCard.
