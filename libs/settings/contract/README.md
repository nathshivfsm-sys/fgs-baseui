# `@cms/settings-contract`

Wire request/response DTOs for the settings MFE. UI, MSW, and `@cms/settings-data-access`
all import from here — do not duplicate these types.

Other remotes follow the same layout: `libs/<mfe>/contract` → `@cms/<mfe>-contract`.
See `.cursor/rules/mfe-lib-folder-structure.mdc` and `context/coding-standards.md`.
