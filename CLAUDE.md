# FGS

A Field service management is the easiest way to get connected with local home service professionals, with all work backed by the FGS

## Context Files

Read the following to get the full context of the project:

- @.claude/context/project-overview.md
- @.claude/context/coding-standards.md
- @.claude/context/forms-implementation-guide.md
- @.claude/context/ai-interaction.md
- @.claude/context/current-feature.md

Each remote owns `libs/<mfe>/contract` (`@cms/<mfe>-contract`) for wire DTOs and
`libs/<mfe>/data-access` for queries/mutations. Do not put catalog DTOs in `libs/shared/`.
See `.cursor/rules/mfe-lib-folder-structure.mdc`.

**IMPORTANT:** Do not add authored by Claude to any commit messages
