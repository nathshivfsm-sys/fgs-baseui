# Implementation Plan — Company Branding entity image upload (UI only)

**Source spec:** [company-branding-image-upload-prd.md](company-branding-image-upload-prd.md)
**Branch (proposed):** `feature/company-branding-image-upload`

**Codebase context:** Nx + Vite Module Federation. Presentational primitives live in
`@cms/ui` (`libs/ui`, tag `scope:shared`), imported through the barrel, shared as an MF
singleton. Settings General Info is page-owned under
`apps/settings/src/pages/CompanySettingsPage/`; `BrandingSection` is currently static
(placeholder + inert buttons). File Service factories already exist in
`@cms/shared-data-access` (`libs/shared/data-access/src/lib/attachment/`) — **do not
import them this pass.** Forms stay on React Hook Form; logo actions must not touch
`dirtyFields`. Named handlers only. Tailwind v4 semantic tokens; no new icon.

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

## Task Breakdown

| # | Task | Maps to Requirement(s) | File(s) | Depends On |
|---|------|------------------------|---------|------------|
| 1 | **Store contract + memory implementation.** `EntityImageRef`, `EntityImageValue`, `EntityImageStore`. `createMemoryEntityImageStore()` keyed by `entityType:entityId:slot`. `put` creates `URL.createObjectURL`, revokes the previous URL for that key, returns metadata + `file`. `get` returns the current value or `null`. `remove` revokes and deletes. Export a process-wide `memoryEntityImageStore` singleton. No network. | FR-3, FR-4, FR-6, FR-10 | `libs/ui/src/components/ui/entity-image-upload/entity-image-store.ts`, `…/types.ts` | — |
| 2 | **`EntityImageUpload` component.** Card chrome matching Branding (title, sunken preview, Upload / Change, Remove + `TrashIcon`). Hidden file input. Mount: `store.get` (default `memoryEntityImageStore`). Upload/change: validate then `put`. Remove: `remove` when a value exists. Inline `role="alert"` errors. `disabled` / empty-Remove rules. Named handlers only. Revoke is the store’s job — the component must not `revokeObjectURL` on unmount of a still-stored preview. | FR-1, FR-2, FR-7 – FR-14, FR-18 – FR-20, §7 | `libs/ui/src/components/ui/entity-image-upload/entity-image-upload.tsx`, `…/index.ts` | Task 1 |
| 3 | **Export and provenance.** Re-export from the `@cms/ui` barrel. Add a provenance row under “(c) Bespoke FieldPro” explaining there is no registry `FileUpload` we want, and this component is entity-keyed rather than a generic dropzone. | FR-1 | `libs/ui/src/components/ui/index.ts`, `libs/ui/README.md` | Task 2 |
| 4 | **Storybook.** Autodocs stories with `play` functions: Empty; SeededGet (pre-`put` on a unique identity, assert img); Upload (userEvent upload, assert preview); Change; Remove (preview gone, Remove disabled); InvalidType / Oversize (alert copy, previous preview kept); IndependentSlots (two instances, same `entityType`/`entityId`, different `slot`); CustomStore (`fn()` adapter, assert `get`/`put`/`remove` called with the ref). Use distinct `entityId`s per story so the singleton does not leak. | FR-4, FR-7, FR-9 – FR-14, FR-17, §8 | `libs/ui/src/components/ui/entity-image-upload/entity-image-upload.stories.tsx` | Task 2 |
| 5 | **Company identity constant + BrandingSection.** Page-owned constant for the two slots (`entityType: 'company'`, `entityId: '1'`, slot/category/logoVariant). `BrandingSection` maps that list to `EntityImageUpload`. Delete the duplicated static button markup. Import through the page `constant/` barrel. | FR-15, FR-16, FR-17 | `apps/settings/src/pages/CompanySettingsPage/constant/company-branding.ts`, `…/constant/index.ts`, `…/component/general-info/BrandingSection.tsx` | Task 3 |
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
