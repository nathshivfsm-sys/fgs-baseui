# Forms & Data Flow

How an API-backed form is built in this workspace.

Wire request/response DTOs always live in `libs/<mfe>/contract` (`@cms/<mfe>-contract`).
Queries, mutations, form schemas, and mappers live in `libs/<mfe>/data-access`. Settings
catalog (`@cms/settings-contract` + `@cms/settings-data-access`) is the reference for that
split. General Info in `apps/settings` is the reference for the form wiring itself.

Keep this document short. A long guide drifts out of date, and a guide that disagrees
with the code is worse than no guide: both people and agents follow it into a second,
parallel pattern.

---

## The flow

One direction, no hidden steps:

```
UI (section components)
  → Form (useForm + FormProvider, seeded from the query)
  → Validation (zodResolver + <feature>FormSchema)
  → Mutation (<feature>MutationOptions → customFetch PATCH)
  → Query cache (invalidate the detail key)
  → UI (form re-seeds from the refetch)
```

Where each step lives:

| Step | Where | Owns |
| ------------ | ----------------------------------- | ------------------------------------------ |
| Wire shape | `libs/<mfe>/contract` (`@cms/<mfe>-contract`) | request/response DTOs, envelopes, list params |
| Form shape | `libs/<mfe>/data-access` `<module>/<module>.form.ts` | `<feature>FormSchema` + its inferred type |
| Translation | same module file (or `<module>.mappers.ts` if it outgrows form) | `to<Feature>Profile`, `to<Feature>Patch` |
| Cache keys | `libs/<mfe>/data-access` `<module>/<module>.keys.ts` | `<feature>Keys` |
| Read | `<module>.queries.ts` | `load…`, `<feature>QueryOptions` |
| Write | `<module>.mutations.ts` | `save…` / `patch…`, `<feature>MutationOptions` |
| Endpoint | `<module>.endpoints.ts` | the URL, in one place |

UI and MSW import wire types from the contract. Do not copy DTOs into page `types/`,
data-access, or mocks — page `types/` is for component props and other UI types, not
wire shapes. Form schemas stay in data-access because they are a screen concern, not a
transport concern.

Screens live in `apps/<app>/src/pages/<PageName>/`. The page file is a thin arrow
orchestrator; props interfaces live in `types/` and are re-exported from `types/index.ts`.
`component/<Feature>Form.tsx` owns `useForm`. Split section, table, dialog, and action
markup into small sibling components (a nested folder when a panel grows). Query and
mutation state that would bloat the parent belongs in a colocated `use-*.ts` hook.
Section components read the form off context. See the React and Types placement
sections of `coding-standards.md`.

---

## Rules that are not obvious

**Two schemas, not one.** The wire schema (in the contract lib) is lenient (`nullish` on
every display string) so one missing field cannot blank a screen; the form schema (in
data-access) is strict because required-ness is a form concern, not a transport concern.
They are different types with different jobs — do not reuse one for both.

**Options factories, not hooks.** A data-access lib exports `queryOptions` and
`mutationOptions` objects, never `useThing()` hooks. Hooks would hide the `queryClient`,
which a federated remote must take from `runtime` (see `libs/platform-contract/README.md`).

**The mutation owns its invalidation.** `<feature>MutationOptions` takes the
`queryClient` and invalidates its own key, so the cache rule sits next to the key
factory and no screen can target the wrong key.

**Save feedback is read off the mutation.** `mutation.isSuccess` / `mutation.error`, not
mirrored `useState`. `mutate` clears the previous result on its own.

**Patch only what changed.** `to<Feature>Patch(values, dirtyFields)` builds the body from
React Hook Form's `dirtyFields`, sending a cleared optional field as `null` and never as
`''`. Read-only fields are absent from the form schema, so they can never be dirty and
can never be sent.

**Never a manual query-to-form `useEffect`.** Seed with `values`, plus
`resetOptions: { keepDirtyValues: true }` so a background refetch cannot overwrite what
the user is typing.

**No `as Resolver<…>` cast on `zodResolver`.** It is not needed, and it silences the real
error you get when a schema's input and output types diverge (`.default()`, `z.coerce`).

---

## Adding a form

```ts
// 1. libs/<mfe>/contract — wire DTO (shared with MSW and UI)
export const ptoSummaryDtoSchema = z.object({
  id: z.number(),
  code: z.string(),
  annualAllowance: z.number(),
});
export type PtoSummaryDto = z.infer<typeof ptoSummaryDtoSchema>;

// 2. libs/<mfe>/data-access — form schema (screen-only)
export const ptoFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(10),
  annualAllowance: z.number().positive('Must be greater than 0'),
});
export type PtoForm = z.infer<typeof ptoFormSchema>;

// 3. libs/<mfe>/data-access/src/lib/pto/pto.keys.ts
export const ptoKeys = {
  all: ['pto'] as const,
  lists: () => [...ptoKeys.all, 'list'] as const,
  list: (companyId: string) => [...ptoKeys.lists(), companyId] as const,
} as const;

// 4. pto.queries.ts
export const ptoListQueryOptions = (companyId: string) =>
  queryOptions({
    queryKey: ptoKeys.list(companyId),
    queryFn: ({ signal }) => loadPtos(companyId, { signal }),
    meta: { feature: 'pto', operation: 'list' },
  });

// 5. pto.mutations.ts
export const savePtoMutationOptions = (
  companyId: string,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (patch: PtoPatchDto) => savePto(companyId, patch),
    meta: { feature: 'pto', operation: 'update' },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ptoKeys.list(companyId) }),
  });
```

```tsx
// 6. apps/<app>/src/pages/<PageName> — the screen reads one line per direction
const query = useQuery(ptoListQueryOptions(companyId), queryClient);
const mutation = useMutation(savePtoMutationOptions(companyId, queryClient), queryClient);

// 7. apps/<app>/src/pages/<PageName>/component — the form
const form = useForm({
  mode: 'onBlur',
  resolver: zodResolver(ptoFormSchema),
  values: data.form,
  resetOptions: { keepDirtyValues: true },
});
```

```tsx
// 8. Sections list fields; wrappers in the page's component/form/ do the binding
<FormTextInput<PtoForm> label="Code" name="code" required />
<FormSelectField<PtoForm> label="Type" name="type" options={PTO_TYPE_OPTIONS} />
```

Errors: let `ApiError` propagate out of the query function and map status to copy in one
`describe<Feature>Error` function in the owning page's `util/` folder.

UI types for list rows and lookups come from the contract:

```ts
import type { PtoSummaryDto } from '@cms/<mfe>-contract';
```

---

## Testing a form

No API seam in production signatures. `AppProps` is `{ runtime }` no matter how many
endpoints a screen grows — stub the transport instead, at the one place both test tiers
already do:

- **`test:query`** (`tools/integration`) — `vi.stubGlobal('fetch', …)` plus
  `configureCustomFetch`. Covers mapping, dirty-only patches, headers, abort, `ApiError`,
  and the invalidation rule.
- **`storybook:test`** — `createStoryApi()` from `.storybook/fixtures/api.ts`, installed
  from a story's `beforeEach`, with handlers keyed `"<METHOD> <endpoint>"`. Stories then
  assert on the recorded request (`api.requests`), which exercises the real
  `customFetch` → Zod → mapper path. See `apps/settings/src/App.stories.tsx`.
