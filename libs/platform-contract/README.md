# @cms/platform-contract

The shared contract between the shell and its federated remotes. Two things live here:
the **runtime object** the shell hands to every remote, and the **single source of React
Query client defaults** for the whole workspace.

It is deliberately dependency-light and has no UI. Anything a remote needs from its host
crosses this boundary, so a change here is a change to every app's contract.

## The runtime

```ts
import type { CmsRuntime } from '@cms/platform-contract';

interface CmsRuntime {
  tenantId: string;
  currentUser: UserDetails;
  queryClient: QueryClient;
}
```

The shell creates one runtime for the browser page and passes it to remotes through
providers. A hosted remote **must** use the `queryClient` it is given, and must never
clear it when that remote unmounts — the cache belongs to the page, not to any one remote.

## The query client

```ts
import { createCmsQueryClient, disposeCmsQueryClient, logCmsQueryError } from '@cms/platform-contract';

// Shell, or a remote running standalone — one module-scoped client per page.
const queryClient = createCmsQueryClient({ onError: logCmsQueryError });
```

Shared defaults (`CMS_QUERY_DEFAULTS`): 30s stale time, 10min garbage collection, one query
retry with capped exponential backoff, no mutation retries, refetch on mount and reconnect,
no refetch on window focus.

- Pass `onError` for telemetry. User-facing error messages stay the feature's job.
- Endpoint-specific behavior belongs in a feature-local `queryOptions` factory in the owning
  data-access lib — not in a second QueryClient.
- Storybook and tests create isolated clients and call `disposeCmsQueryClient` during teardown.

Query keys must start with a unique feature scope and include every variable that changes the
response. Invalidate the narrowest key possible; cross-feature prefix invalidation needs an
explicit product reason.

## Verify

`pnpm run test:query` covers the defaults, request deduplication, cancellation, cache sharing,
standalone isolation, tenant scoping, and the error callback.

Build with `pnpm exec nx build platform-contract`.

See the "Data fetching architecture" section of the root `README.md` for how this fits together
across the shell and its remotes.
