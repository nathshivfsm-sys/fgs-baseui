# @cms/customer-ui

Shared **customer + service location create** UI used by:

- `apps/customer` — full create flow (`billToAndServiceLocation` / `billToOnly`)
- `apps/servicelocation` (planned) — add SL to an existing Bill To (reuse SL section + shared form pieces)

Move target from `apps/customer/src/pages/CreateCustomerPage/`:

- `CreateCustomerForm`, `ServiceLocationSection`, `ArCustomerSection`
- Address dialog/card, primary contact, tags, form wrappers, Same-as hook
- Form constants/types (not page routes or list/detail screens)

Wire types and `customerCreateFormSchema` / `toCustomerCreateDto` stay in `@cms/customer-data-access`.
