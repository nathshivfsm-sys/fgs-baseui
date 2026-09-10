# React Hook Form + Zod Implementation Guide

For company settings, PTO, tax codes, and business units forms.

---

## Architecture Overview

```
Data Layer (data-access lib)
├── Zod Schemas → Validation + Type inference
├── Query Hooks → Fetch data (useQuery)
└── Mutation Hooks → Create/Update/Delete (useMutation)
        ↓
Component Layer (app)
├── Form Component → useForm + useFieldArray
├── React Hook Form validation (via zodResolver)
└── Mutation calls on submit
        ↓
API Layer (@cms/shared-api)
└── customFetch wrapper (handles auth, errors)
```

---

## Step 1: Install Dependencies

```bash
pnpm add react-hook-form @hookform/resolvers
```

Note: `zod` is already a dependency.

---

## Step 2: Create Data-Access Library Structure

### 2.1 Zod Schemas

**File:** `libs/settings/data-access/src/lib/schemas/company-settings.schema.ts`

```typescript
import { z } from 'zod';

// Individual resource schemas
export const ptoSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'PTO code is required').max(10),
  label: z.string().min(1, 'Label is required'),
  annualAllowance: z.number().positive('Must be greater than 0'),
});

export const taxCodeSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Tax code required').max(10),
  description: z.string().optional(),
  rate: z.number().min(0).max(100, 'Rate must be 0-100'),
});

export const businessUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'BU name required'),
  code: z.string().min(1, 'BU code required').max(10),
  active: z.boolean().default(true),
});

// Main settings form schema
export const companySettingsSchema = z.object({
  companyId: z.string(),
  companyName: z.string().min(1, 'Company name required'),
  contactEmail: z.string().email('Valid email required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  ptos: z.array(ptoSchema).default([]),
  taxCodes: z.array(taxCodeSchema).default([]),
  businessUnits: z.array(businessUnitSchema).default([]),
});

// Type exports (inferred from schemas)
export type CompanySettings = z.infer<typeof companySettingsSchema>;
export type Pto = z.infer<typeof ptoSchema>;
export type TaxCode = z.infer<typeof taxCodeSchema>;
export type BusinessUnit = z.infer<typeof businessUnitSchema>;
```

### 2.2 Query Keys Factory

**File:** `libs/settings/data-access/src/lib/queries/query-keys.ts`

```typescript
export const SETTINGS_QUERY_KEYS = {
  all: ['company-settings'] as const,
  detail: (companyId: string) => [...SETTINGS_QUERY_KEYS.all, companyId] as const,
  ptos: (companyId: string) => [...SETTINGS_QUERY_KEYS.detail(companyId), 'ptos'] as const,
  taxCodes: (companyId: string) => [...SETTINGS_QUERY_KEYS.detail(companyId), 'tax-codes'] as const,
  businessUnits: (companyId: string) => [...SETTINGS_QUERY_KEYS.detail(companyId), 'business-units'] as const,
} as const;
```

### 2.3 Query Hooks

**File:** `libs/settings/data-access/src/lib/queries/use-company-settings.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@cms/shared-api';
import { companySettingsSchema, CompanySettings } from '../schemas/company-settings.schema';
import { SETTINGS_QUERY_KEYS } from './query-keys';

async function fetchCompanySettings(companyId: string): Promise<CompanySettings> {
  const dto = await customFetch<unknown>(`/company/${companyId}/settings`);
  return companySettingsSchema.parse(dto);
}

export function useCompanySettings(companyId: string) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.detail(companyId),
    queryFn: () => fetchCompanySettings(companyId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 2.4 Mutation Hooks

**File:** `libs/settings/data-access/src/lib/mutations/use-update-company-settings.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '@cms/shared-api';
import { companySettingsSchema, CompanySettings } from '../schemas/company-settings.schema';
import { SETTINGS_QUERY_KEYS } from '../queries/query-keys';

async function updateCompanySettings(
  companyId: string,
  settings: CompanySettings
): Promise<CompanySettings> {
  const dto = await customFetch<unknown>(`/company/${companyId}/settings`, {
    method: 'PATCH',
    body: settings,
  });
  return companySettingsSchema.parse(dto);
}

export function useUpdateCompanySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, settings }: { companyId: string; settings: CompanySettings }) =>
      updateCompanySettings(companyId, settings),
    onSuccess: (data, { companyId }) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEYS.detail(companyId), data);
    },
  });
}
```

**Similar mutations for individual items:**

```typescript
// use-create-pto.ts
export function useCreatePto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, pto }: { companyId: string; pto: Pto }) =>
      customFetch(`/company/${companyId}/ptos`, { method: 'POST', body: pto }),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.ptos(companyId) });
    },
  });
}

// use-delete-pto.ts
export function useDeletePto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ companyId, ptoId }: { companyId: string; ptoId: string }) =>
      customFetch(`/company/${companyId}/ptos/${ptoId}`, { method: 'DELETE' }),
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.ptos(companyId) });
    },
  });
}
```

### 2.5 Export Index

**File:** `libs/settings/data-access/src/index.ts`

```typescript
// Schemas
export * from './lib/schemas/company-settings.schema';

// Queries
export { useCompanySettings } from './lib/queries/use-company-settings';
export { SETTINGS_QUERY_KEYS } from './lib/queries/query-keys';

// Mutations
export { useUpdateCompanySettings } from './lib/mutations/use-update-company-settings';
export { useCreatePto } from './lib/mutations/use-create-pto';
export { useDeletePto } from './lib/mutations/use-delete-pto';
export { useCreateTaxCode } from './lib/mutations/use-create-tax-code';
export { useDeleteTaxCode } from './lib/mutations/use-delete-tax-code';
export { useCreateBusinessUnit } from './lib/mutations/use-create-business-unit';
export { useDeleteBusinessUnit } from './lib/mutations/use-delete-business-unit';
```

---

## Step 3: Component Implementation

### 3.1 Main Form Component

**File:** `apps/shell/src/components/CompanySettingsForm.tsx`

```typescript
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanySettings, useUpdateCompanySettings, companySettingsSchema } from '@cms/settings-data-access';
import type { CompanySettings } from '@cms/settings-data-access';
import { Button } from '@cms/ui/components/ui/button';
import { useToast } from '@cms/ui/hooks/use-toast';
import { TextInput } from '@cms/ui/components/text-input';
import { PtosFieldArray } from './sections/PtosFieldArray';
import { TaxCodesFieldArray } from './sections/TaxCodesFieldArray';
import { BusinessUnitsFieldArray } from './sections/BusinessUnitsFieldArray';

interface CompanySettingsFormProps {
  companyId: string;
}

export function CompanySettingsForm({ companyId }: CompanySettingsFormProps) {
  const { data: settings, isLoading } = useCompanySettings(companyId);
  const { mutate: updateSettings, isPending } = useUpdateCompanySettings();
  const { toast } = useToast();

  const form = useForm<CompanySettings>({
    resolver: zodResolver(companySettingsSchema),
    values: settings || {
      companyId,
      companyName: '',
      contactEmail: '',
      phone: '',
      address: '',
      ptos: [],
      taxCodes: [],
      businessUnits: [],
    },
  });

  const onSubmit = (data: CompanySettings) => {
    updateSettings(
      { companyId, settings: data },
      {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Settings updated successfully' });
        },
        onError: (error) => {
          toast({ 
            title: 'Error', 
            description: error instanceof Error ? error.message : 'Failed to update settings',
            variant: 'destructive' 
          });
        },
      }
    );
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Info Section */}
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold">Company Information</legend>
          <TextInput
            label="Company Name"
            placeholder="Enter company name"
            {...form.register('companyName')}
            error={form.formState.errors.companyName?.message}
          />
          <TextInput
            label="Contact Email"
            type="email"
            placeholder="Enter contact email"
            {...form.register('contactEmail')}
            error={form.formState.errors.contactEmail?.message}
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            {...form.register('phone')}
            error={form.formState.errors.phone?.message}
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            {...form.register('address')}
            error={form.formState.errors.address?.message}
          />
        </fieldset>

        {/* PTOs Section */}
        <PtosFieldArray control={form.control} errors={form.formState.errors} />

        {/* Tax Codes Section */}
        <TaxCodesFieldArray control={form.control} errors={form.formState.errors} />

        {/* Business Units Section */}
        <BusinessUnitsFieldArray control={form.control} errors={form.formState.errors} />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
```

### 3.2 Field Array Component (Reusable Pattern)

**File:** `apps/shell/src/components/sections/PtosFieldArray.tsx`

```typescript
import { useFieldArray, Control, FieldErrors } from 'react-hook-form';
import type { CompanySettings, Pto } from '@cms/settings-data-access';
import { Button } from '@cms/ui/components/ui/button';
import { TextInput } from '@cms/ui/components/text-input';
import { NumberInput } from '@cms/ui/components/number-input';
import { Trash2Icon } from '@cms/ui/icons';

interface PtosFieldArrayProps {
  control: Control<CompanySettings>;
  errors: FieldErrors<CompanySettings>;
}

export function PtosFieldArray({ control, errors }: PtosFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ptos',
  });

  const addNewPto = () => {
    append({ code: '', label: '', annualAllowance: 0 } as Pto);
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">PTO Types</legend>

      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="flex gap-3 items-end p-3 bg-slate-50 rounded-lg"
            data-testid={`pto-row-${idx}`}
          >
            <TextInput
              label="Code"
              placeholder="e.g., VACATION"
              {...control.register(`ptos.${idx}.code`)}
              error={errors.ptos?.[idx]?.code?.message}
              className="flex-1"
            />
            <TextInput
              label="Label"
              placeholder="e.g., Vacation Days"
              {...control.register(`ptos.${idx}.label`)}
              error={errors.ptos?.[idx]?.label?.message}
              className="flex-1"
            />
            <NumberInput
              label="Annual Days"
              {...control.register(`ptos.${idx}.annualAllowance`, { valueAsNumber: true })}
              error={errors.ptos?.[idx]?.annualAllowance?.message}
              className="w-24"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(idx)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2Icon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-6 text-slate-500">
          No PTO types added yet
        </div>
      )}

      <Button type="button" variant="outline" onClick={addNewPto} className="w-full">
        + Add PTO Type
      </Button>
    </fieldset>
  );
}
```

**Apply the same pattern for `TaxCodesFieldArray` and `BusinessUnitsFieldArray`.**

---

## Step 4: Integration Pattern

### 4.1 Form State Management

React Hook Form manages:
- Form state (touched, dirty, values)
- Validation (via zodResolver)
- Field-level errors
- Submission state

TanStack Query manages:
- Server state (what's on the API)
- Loading/error states
- Cache invalidation

**They work together:**
```
Component receives data from useCompanySettings (Query)
  ↓
useForm populates with values from query
  ↓
User edits form
  ↓
React Hook Form validates locally
  ↓
User submits → useUpdateCompanySettings mutation fires
  ↓
Query cache invalidated/updated
  ↓
Form reflects new data (if needed)
```

### 4.2 Handling Nested Arrays

For dynamic item creation (add/remove PTO, tax code, BU):

**Option A: Local form state only** (recommended for this case)
- User adds/removes rows in form
- All changes submit together in one PATCH request
- Simple, atomic

```typescript
// User clicks "Add PTO" → append to form array
// User modifies values → React Hook Form tracks
// User clicks "Save Settings" → entire form submits via PATCH
```

**Option B: Individual mutations** (if you need real-time API calls)
- Each add/remove fires its own POST/DELETE
- More server calls, but updates immediately

```typescript
// For Item additions:
const { mutate: createPto } = useCreatePto();
const handleAddPto = (newPto) => {
  createPto({ companyId, pto: newPto },
    { onSuccess: () => { /* form updates */ } }
  );
};
```

### 4.3 Form Submission Flow

```typescript
const onSubmit = (data: CompanySettings) => {
  // data is already validated by zodResolver
  updateSettings(
    { companyId, settings: data },
    {
      onSuccess: (updatedData) => {
        // Show success
        toast.success('Settings saved');
        // Optional: refetch to confirm
      },
      onError: (error) => {
        // Show error message
        toast.error(error.message);
        // Form stays populated so user can retry
      },
    }
  );
};
```

---

## Step 5: Error Handling

### 5.1 Validation Errors (Client-side)

Caught by `zodResolver`, displayed per field:

```typescript
<TextInput
  label="Email"
  {...form.register('contactEmail')}
  error={form.formState.errors.contactEmail?.message}
/>
```

### 5.2 API Errors (Server-side)

Thrown as `ApiError` from `customFetch`, caught in mutation's `onError`:

```typescript
{
  onError: (error) => {
    if (error instanceof ApiError) {
      if (error.status === 409) {
        toast.error('Settings already updated by another user');
      } else {
        toast.error(error.message);
      }
    }
  },
}
```

---

## Step 6: Testing Strategy

### Unit: Zod Schemas

```typescript
// company-settings.schema.test.ts
import { companySettingsSchema } from './company-settings.schema';

describe('companySettingsSchema', () => {
  it('validates correct data', () => {
    const valid = {
      companyId: '123',
      companyName: 'Test Inc',
      contactEmail: 'test@example.com',
      ptos: [{ code: 'VAC', label: 'Vacation', annualAllowance: 20 }],
      taxCodes: [],
      businessUnits: [],
    };
    expect(() => companySettingsSchema.parse(valid)).not.toThrow();
  });

  it('rejects invalid email', () => {
    const invalid = { ...valid, contactEmail: 'not-an-email' };
    expect(() => companySettingsSchema.parse(invalid)).toThrow();
  });
});
```

### Integration: Query Hooks

Use `pnpm run test:query` (Vitest in `tools/integration`)

```typescript
// test:query runs tests in Node environment
// Test customFetch + Zod validation integration
```

### Component: Storybook Stories

**File:** `apps/shell/src/components/CompanySettingsForm.stories.tsx`

```typescript
import { Meta, StoryObj } from '@storybook/react';
import { CompanySettingsForm } from './CompanySettingsForm';
import { QueryClientProvider } from '@tanstack/react-query';
import { createCmsQueryClient } from '@cms/platform-contract';

const meta = {
  component: CompanySettingsForm,
  decorators: [
    (Story) => (
      <QueryClientProvider client={createCmsQueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof CompanySettingsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { companyId: 'test-company-id' },
  play: async ({ canvasElement }) => {
    // Test interaction: fill form, submit
  },
};
```

---

## Step 7: API Endpoint Contract

Backend must provide:

| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| GET | `/company/{companyId}/settings` | — | `CompanySettings` |
| PATCH | `/company/{companyId}/settings` | `CompanySettings` | `CompanySettings` |
| POST | `/company/{companyId}/ptos` | `Pto` | `Pto` (with ID) |
| DELETE | `/company/{companyId}/ptos/{ptoId}` | — | `{ success: true }` |
| POST | `/company/{companyId}/tax-codes` | `TaxCode` | `TaxCode` (with ID) |
| DELETE | `/company/{companyId}/tax-codes/{taxCodeId}` | — | `{ success: true }` |
| POST | `/company/{companyId}/business-units` | `BusinessUnit` | `BusinessUnit` (with ID) |
| DELETE | `/company/{companyId}/business-units/{buId}` | — | `{ success: true }` |

All error responses should be `{ status: number, message: string }` (caught by `ApiError`).

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Opens Settings Tab                   │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ useCompanySettings
         │ (TanStack Query)  │ ──fetch──► /company/{id}/settings
         └────────┬─────────┘
                  │
                  ▼
         ┌─────────────────────────────┐
         │ Zod.parse(response)         │
         │ (Validate API response)     │
         └────────┬────────────────────┘
                  │
                  ▼
         ┌─────────────────────────────┐
         │ useForm with values         │
         │ (Populate form fields)      │
         └────────┬────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    User Edits Form Fields                        │
│  - React Hook Form tracks changes (not re-rendering everything) │
│  - Local validation against Zod schema                          │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   User Clicks "Save Settings"                    │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
         Zod validates entire form
         ├─ Valid: Continue to submission
         └─ Invalid: Show field-level errors, stop
         │
         ▼
┌──────────────────────────────┐
│ useUpdateCompanySettings     │
│ (TanStack Query Mutation)    │ ──POST/PATCH──► /company/{id}/settings
└────────┬─────────────────────┘
         │
         ▼
    Zod.parse(response)
         │
    ┌────┴─────┬──────────┐
    │           │          │
   ✅          ❌        Timeout
   Success   Error
    │           │
    ▼           ▼
Show Toast   Show Error
Update       Toast
Cache
```

---

## Common Patterns

### Pattern 1: Pre-fill form from API

```typescript
const form = useForm<CompanySettings>({
  resolver: zodResolver(companySettingsSchema),
  values: settings || defaultValues, // Auto-populates when query succeeds
});
```

### Pattern 2: Reset form to server state

```typescript
<Button onClick={() => form.reset()}>
  Cancel
</Button>
```

### Pattern 3: Disable submit while loading or submitting

```typescript
<Button type="submit" disabled={isPending || isLoading}>
  {isPending ? 'Saving...' : 'Save'}
</Button>
```

### Pattern 4: Handle async field validation

```typescript
const form = useForm<CompanySettings>({
  resolver: zodResolver(companySettingsSchema),
  mode: 'onBlur', // Validate on blur for better UX
});
```

### Pattern 5: Watch specific fields for conditional rendering

```typescript
const businessUnits = form.watch('businessUnits');

// Only show tax rates section if business units exist
{businessUnits.length > 0 && <TaxCodesFieldArray />}
```

---

## Summary Checklist

- [ ] Install `react-hook-form` and `@hookform/resolvers`
- [ ] Create `libs/settings/data-access` library
- [ ] Define Zod schemas in `schemas/`
- [ ] Create query hooks in `queries/`
- [ ] Create mutation hooks in `mutations/`
- [ ] Build form component with `useForm` + `zodResolver`
- [ ] Build field array components for dynamic items
- [ ] Add proper error handling and toasts
- [ ] Write Zod schema tests
- [ ] Add Storybook stories with interactions
- [ ] Verify API contract with backend team
- [ ] Test in browser with dev servers
- [ ] Run: `pnpm run lint`, `pnpm run typecheck`, `pnpm run build`
- [ ] Run: `pnpm run test:query`, `pnpm run storybook:test`
