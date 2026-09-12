# `@cms/settings-data-access`

TanStack Query options factories, endpoints, form schemas, and mappers for the
settings MFE.

Wire request/response DTOs live in `@cms/settings-contract`, not here. Import them.
Do not declare a second Tax / TaxAuthority / NonWorkingDate / Zone type.

Other remotes follow the same split: `libs/<mfe>/data-access` beside
`libs/<mfe>/contract`. See `.cursor/rules/mfe-lib-folder-structure.mdc`.
