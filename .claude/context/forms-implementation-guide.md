# Forms & Data Flow

How an API-backed form is built in this workspace. This describes the code as it is —
`libs/settings/data-access` + `apps/settings` General Info is the reference
implementation, so read those files if anything here is ambiguous.

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

| Step | File in `libs/<feature>/data-access/src/lib/` | Owns |
| ------------ | ----------------------------------- | ------------------------------------------ |
| Wire shape | `schemas/<feature>.schema.ts` | `<feature>DtoSchema`, `<feature>ResponseSchema` |
| Form shape | `schemas/<feature>.schema.ts` | `<feature>FormSchema` + its inferred type |
| Translation | `mappers/<feature>.mappers.ts` | `to<Feature>Profile`, `to<Feature>Patch` |
| Cache keys | `queries/query-keys.ts` | `<feature>Keys` |
| Read | `queries/<feature>.queries.ts` | `load…`, `<feature>QueryOptions` |
| Write | `mutations/<feature>.mutations.ts` | `save…`, `<feature>MutationOptions` |
| Endpoint | `<feature>.endpoints.ts` | the URL, in one place |

Screens live in `apps/<app>/src/pages/<PageName>/`: the page route target wires the query
and mutation, `component/<Feature>Form.tsx` owns `useForm`, and its page-owned section
components read the form off context.

---

## Rules that are not obvious

**Two schemas, not one.** The wire schema is lenient (`nullish` on every display
string) so one missing field cannot blank a screen; the form schema is strict because
required-ness is a form concern, not a transport concern. They are different types with
different jobs — do not reuse one for both.

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
// 1. libs/<feature>/data-access — schema (form half)
export const ptoFormSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(10),
  annualAllowance: z.number().positive('Must be greater than 0'),
});
export type PtoForm = z.infer<typeof ptoFormSchema>;

// 2. queries/query-keys.ts
export const ptoKeys = {
  all: ['ptos'] as const,
  list: (companyId: string) => [...ptoKeys.all, companyId] as const,
} as const;

// 3. queries/pto.queries.ts
export const ptoListQueryOptions = (companyId: string) =>
  queryOptions({
    queryKey: ptoKeys.list(companyId),
    queryFn: ({ signal }) => loadPtos(companyId, { signal }),
    meta: { feature: 'ptos', operation: 'list' },
  });

// 4. mutations/pto.mutations.ts
export const savePtoMutationOptions = (
  companyId: string,
  queryClient: QueryClient,
) =>
  mutationOptions({
    mutationFn: (patch: PtoPatch) => savePto(companyId, patch),
    meta: { feature: 'ptos', operation: 'update' },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ptoKeys.list(companyId) }),
  });
```

```tsx
// 5. apps/<app>/src/pages/<PageName> — the screen reads one line per direction
const query = useQuery(ptoListQueryOptions(companyId), queryClient);
const mutation = useMutation(savePtoMutationOptions(companyId, queryClient), queryClient);

// 6. apps/<app>/src/pages/<PageName>/component — the form
const form = useForm({
  mode: 'onBlur',
  resolver: zodResolver(ptoFormSchema),
  values: data.form,
  resetOptions: { keepDirtyValues: true },
});
```

```tsx
// 7. Sections list fields; wrappers in the page's component/form/ do the binding
<FormTextInput<PtoForm> label="Code" name="code" required />
<FormSelectField<PtoForm> label="Type" name="type" options={PTO_TYPE_OPTIONS} />
```

Errors: let `ApiError` propagate out of the query function and map status to copy in one
`describe<Feature>Error` function in the owning page's `util/` folder.

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
