# Dispatch Board spike (throwaway)

Evaluation harness for **FullCalendar Premium `resourceTimeline` v7.0.2** as the
Dispatch Board engine. Not a design-system component.

## Why it lives here

`libs/ui` is where Storybook is anchored, so this is the cheapest place to run a
visual spike. Two deliberate constraints keep it from leaking into the product:

- **Not exported from `libs/ui/src/index.ts`.** Nothing can import it by
  accident, so no Module Federation remote pulls FullCalendar into its bundle.
- **FullCalendar is a root `devDependency`, not a `libs/ui` dependency.** The
  published surface of `@cms/ui` is unchanged.

`libs/ui` has no `build` target — it is consumed as raw source through its
`exports` map — so nothing sweeps this folder into a bundle.

## Run it

```bash
nvm use            # 20.19.0, per .nvmrc
pnpm run storybook # then open Spikes/Dispatch Board
```

## What it proves (or disproves)

| Question | Where to look |
| --- | --- |
| Technicians as rows on an hour axis | `Default` story |
| Drag between rows → reassign | drag an event vertically; read the gesture log |
| Drag along the axis → reschedule | drag an event horizontally |
| Resize → duration change | drag an event edge |
| Drag in from an outside list → assign | drag a queue card onto a row |
| Synchronous pre-drop veto | `Default` refuses a trade mismatch; `WithoutTradeMatching` allows it |
| Custom event card rendering | multi-line card, fields appear by container width |
| Custom row header rendering | avatar, name, `Region \| Trade`, hours |
| Theming from FieldPro tokens | `dispatch-board-spike.css` maps `--fc-monarch-*`; toggle Storybook's light/dark |
| Row volume | `Volume50/100/200Technicians` |
| Accessibility baseline | a11y panel; `test` is `todo` here, not `error` |

## Licence

Uses `CC-Attribution-NonCommercial-NoDerivatives`, FullCalendar's published
evaluation key. **Evaluation only — not valid for production or commercial use.**
Shipping requires a purchased FullCalendar Premium licence.

## Delete criteria

Once the go / no-go decision is recorded in the dispatch-board spec, delete this
folder and move the FullCalendar dependency to the owning project.
