# `@cms/shared-mocks`

Browser MSW handlers for local development. Application code and TanStack Query
callers do not import this library — only app bootstrap does, behind
`VITE_USE_MOCK_API`.

## Enable

In `apps/shell/.env.local` (copy from `.env.example`):

```env
VITE_USE_MOCK_API=true
VITE_API_URL=/api/v1
VITE_DEV_REFRESH_TOKEN=mock-refresh-token
```

`VITE_USE_MOCK_API=false` (or unset) leaves `fetch` untouched, so the real APIs
and the Vite `/api/v1` proxy work exactly as before. Bootstrap also unregisters
a leftover `mockServiceWorker.js` so a previous mock session cannot keep
intercepting. Restart the Vite dev server after changing the flag.

Login still goes through `refreshAccessToken()`; Settings still goes through
`loadCompanySettings` / `saveCompanySettings`. MSW intercepts those URLs in the
browser.

## Add a domain

Handlers import wire DTOs and request schemas from the owning MFE contract
(`@cms/settings-contract`, later `@cms/lead-contract`, etc.). Do not duplicate DTOs
here and do not import `@cms/<mfe>-data-access` — `scope:shared` cannot depend on a
remote's data-access lib.

1. Add `src/handlers/<domain>.ts` exporting a handler array. Parse writes with the
   contract schemas.
2. Append it in `src/handlers/index.ts`.
3. Copy `mockServiceWorker.js` into any new app `public/` that starts the worker
   (`pnpm exec msw init <publicDir> --save`).
