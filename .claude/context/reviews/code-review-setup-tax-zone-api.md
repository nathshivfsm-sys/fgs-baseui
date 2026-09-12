# Code Review (Standards / Spec) — `a8042bc`

**Commit:** `a8042bc feat(settings): add Zone & Postal Code page with create dialog`
**Diff:** `git diff f58be6be58c0119eedbe9a2a310efa63686ad3f4...a8042bc2ba0ebf6280ecab621a5b20d74d31b846`
(32 files, ~1,200 insertions)

Two-axis review via the `mattpocock-skills:code-review` methodology — **Standards**
(does the code follow this repo's documented conventions?) and **Spec** (does it
match what was asked for?) — run as independent sub-agents so neither axis's
findings bias the other. Not merged or reranked against each other below.

- **Standards sources:** `.claude/context/coding-standards.md`,
  `.cursor/rules/page-folder-structure.mdc`, `.cursor/rules/mfe-lib-folder-structure.mdc`,
  plus the Fowler smell baseline (judgement calls only; a documented repo standard overrides it).
- **Spec source:** no separate PRD exists for this feature. Per this project's own
  workflow (`.claude/context/ai-interaction.md` step 1, "Document"), the "Zone &
  Postal Code page" and "Setup catalog APIs" entries in
  `.claude/context/current-feature.md` are the spec.

---

## Standards

**Worst finding — Duplicated Code, and it breaks the diff's own promotion rule.**
`apps/settings/src/pages/ZonePostalCodePage/component/form/FormTextInput.tsx` is a
byte-for-byte copy of the pre-existing
`apps/settings/src/pages/CompanySettingsPage/component/form/FormTextInput.tsx`.
[.cursor/rules/page-folder-structure.mdc:9](.cursor/rules/page-folder-structure.mdc#L9)
states: *"Promote to `shared/` only after a second page actually imports it."*
This commit **is** that second page — it should have promoted the component to
`apps/settings/src/shared/component/form/`, not re-pasted it. This is a hard
violation of a documented standard, not a judgement call.

- **Duplicated Code / Repeated Switches** —
  [ZonePostalCodePage/util/describe-zone-error.ts](apps/settings/src/pages/ZonePostalCodePage/util/describe-zone-error.ts)
  structurally duplicates the pre-existing
  `CompanySettingsPage/util/describe-company-error.ts` (same `switch` over
  401/403/404/409 + `ZodError` branch, only the strings differ). Same promotion
  rule applies.
- **Dead code / duplicated primitive** —
  [ZonePostalCodePage/constant/copy.ts:1](apps/settings/src/pages/ZonePostalCodePage/constant/copy.ts#L1)
  defines `ZONE_POSTAL_PATH` but it's never imported anywhere; the literal
  `'company/zone-postal-code'` is hand-duplicated three times elsewhere instead
  ([App.tsx:26](apps/settings/src/App.tsx#L26),
  [SetupPage/constant/settings.ts:35,43](apps/settings/src/pages/SetupPage/constant/settings.ts#L35)) —
  exactly what the constant existed to prevent.
- **Divergent Change (judgement call)** — the commit both introduces a new
  documented standard (`named-event-handlers.mdc` + a `coding-standards.md`
  section) and ships an unrelated feature. Worth splitting into two commits.
- *Positive:* the new code fully complies with the named-handler rule, page-folder
  barrel/index conventions, and the contract/data-access split.

**Standards summary:** 4 findings. Worst: the un-promoted `FormTextInput.tsx`
duplicate (hard violation of `page-folder-structure.mdc`).

## Spec

**Worst finding — unverifiable "browser-verified" claim.**
`current-feature.md` states the page was *"implemented and **browser-verified**"*
— but unlike every neighboring entry making that claim, this one has no
`### Verification` block (no commands, no pass counts, no described browser
coverage). Nothing in the diff evidences a browser pass happened.

- **(b) Scope creep** — the spec describes only route, listing, nav cards, and
  the create/edit dialog. The diff adds an undocumented Active/Inactive status
  feature: filter tabs
  ([ZoneTablePanel.tsx:142-151](apps/settings/src/pages/ZonePostalCodePage/component/ZoneTablePanel.tsx#L142-L151)),
  a per-row Activate/Deactivate action
  ([ZoneTablePanel.tsx:65-70,100](apps/settings/src/pages/ZonePostalCodePage/component/ZoneTablePanel.tsx#L65-L70)),
  and MSW fixture zones added solely to populate it
  ([libs/shared/mocks/src/handlers/zone.ts:39-66](libs/shared/mocks/src/handlers/zone.ts#L39-L66)).
- **(c) Implemented but questionable** —
  [ZonePostalCodePage.tsx:20-27](apps/settings/src/pages/ZonePostalCodePage/ZonePostalCodePage.tsx#L20-L27)
  fires two extra lookup queries (`activeLookup`/`allLookup`) purely to compute
  counts, on top of the paginated list query — three concurrent calls for one
  screen, a design choice the spec neither requests nor justifies.
- **(a) Missing/partial:** none — every explicit spec requirement (route, list
  source, nav-card wiring, postal empty-state, dialog field layout, Edit reusing
  it) is present and matches.

**Spec summary:** 3 findings. Worst: the unverified "browser-verified" claim in
`current-feature.md`.

---

*Reviewed by Claude via the `mattpocock-skills:code-review` skill (parallel
Standards/Spec sub-agents) against `develop` at the time of writing. See also
[setup-tax-zone-api.md](setup-tax-zone-api.md) for the earlier severity-tiered
(Must Fix/High/Medium/Low) review of the same branch.*
