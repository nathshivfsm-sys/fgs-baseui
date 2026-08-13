# @cms/ui

Shared UI primitives and the Tailwind CSS v4 design contract for the CMS workspace.

## Styling architecture

- `src/styles/theme.css` registers fonts, responsive/container values, spacing,
  shadows, semantic colors, and radius utilities with Tailwind.
- `src/styles/tokens.css` owns light and dark theme values.
- `src/styles/base.css` contains the minimal cross-application document defaults.
- `src/styles.css` is the public aggregate stylesheet.

Each independently built application imports Tailwind and this aggregate stylesheet
from its own CSS entry point. JavaScript imports remain side-effect free. Published
consumers can import `@cms/ui/styles.css` before scanning their component sources.

Use semantic utilities such as `bg-background`, `bg-brand-subtle`, `text-link`,
`text-label`, `text-destructive`, `border-input`, and `ring-ring`. `primary` represents
the Work Order interaction color (`#3538bf`); `brand` represents the Pricing
navigation color (`#0049bc`). Geist is the default UI family and Inter is available
through `font-form`. The 4/8px radius scale, 32/36/40px control heights, desktop
workspace dimensions, table roles, statuses, and exact Figma shadows are registered
as Tailwind v4 tokens. Prefer standard utilities unless a value expresses one of
these stable product decisions.
