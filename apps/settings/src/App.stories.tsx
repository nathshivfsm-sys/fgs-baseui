import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, userEvent, within } from 'storybook/test';
import {
  createStoryApi,
  jsonResponse,
  pendingResponse,
  STORY_API_TOKEN,
  type ApiHandlers,
} from '../../../.storybook/fixtures/api';
import {
  companyResponseFixture,
  postalCodeListItemsFixture,
  taxLookupItemsFixture,
  zoneListItemsFixture,
} from '../../../.storybook/fixtures/feature-data';
import {
  STORY_COMPANY_ID,
  withCmsRuntime,
} from '../../../.storybook/fixtures/runtime';
import { App } from './App';

const SettingsApp = withCmsRuntime(App);

/**
 * Stories drive the screen through `customFetch`, not through injected loader props —
 * so the Zod parse, the mappers and the PATCH body are all part of what is asserted.
 * The handler keys mirror `companyEndpoint()`.
 */
const api = createStoryApi();
const COMPANY_ENDPOINT = `/company/${STORY_COMPANY_ID}`;

const loadsCompany: ApiHandlers = {
  [`GET ${COMPANY_ENDPOINT}`]: () => jsonResponse(companyResponseFixture),
};

const savesCompany: ApiHandlers = {
  ...loadsCompany,
  [`PATCH ${COMPANY_ENDPOINT}`]: () => new Response(null, { status: 204 }),
};

function SettingsRoutes({
  initialPath = '/settings',
  storyCompanyId,
  storyTenantId,
}: {
  initialPath?: string;
  storyCompanyId?: string | null;
  storyTenantId?: string;
}) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          element={
            <SettingsApp
              storyCompanyId={storyCompanyId}
              storyTenantId={storyTenantId}
            />
          }
          path="/settings/*"
        />
      </Routes>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Features/Settings',
  component: SettingsRoutes,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { initialPath: '/settings' },
  argTypes: {
    initialPath: { table: { disable: true } },
    storyCompanyId: { table: { disable: true } },
  },
  // No handlers by default: a story that reaches the network without declaring one
  // fails with the endpoint it asked for instead of escaping to a real host.
  beforeEach: () => api.install({}),
} satisfies Meta<typeof SettingsRoutes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Setup' })).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Company' })).toHaveAttribute(
      'data-active',
      '',
    );
    await expect(
      canvas.getByRole('button', { name: /^General Info/ }),
    ).toBeVisible();
  },
};

export const SwitchTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Users & Payroll' }));
    await expect(canvas.getByRole('button', { name: /^Roles/ })).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^General Info/ }),
    ).not.toBeInTheDocument();
  },
};

export const SearchFilter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Search settings'), 'tax');
    await expect(
      canvas.getByRole('button', { name: /^Tax & States/ }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^Business Unit/ }),
    ).not.toBeInTheDocument();
  },
};

export const SearchNoResults: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('Search settings'),
      'zzz-no-match',
    );
    await expect(
      canvas.getByText('No settings match "zzz-no-match"'),
    ).toBeVisible();
  },
};

export const GeneralInfo: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(loadsCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('textbox', { name: 'Name' }),
    ).toHaveValue('Acme Field Services');
    await expect(canvas.getByRole('textbox', { name: 'Code' })).toHaveAttribute(
      'readonly',
    );
    await expect(
      canvas.getByRole('textbox', { name: 'Company Number' }),
    ).toHaveValue('1');
    await expect(canvas.getByText('Austin, TX 78701')).toBeVisible();
    await expect(canvas.getByText('No address on file')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled();
    // The session token reaches the API through customFetch, not through the screen.
    const get = api.requests.find((request) => request.method === 'GET');
    await expect(get?.headers.get('Authorization')).toBe(
      `Bearer ${STORY_API_TOKEN}`,
    );
  },
};

export const GeneralInfoSave: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const website = await canvas.findByRole('textbox', { name: 'Website' });
    await userEvent.clear(website);
    await userEvent.type(website, 'www.acme.example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Company details updated'),
    ).toBeVisible();
    // Dirty fields only: nothing but the edited Website reaches the PATCH body.
    const patch = api.requests.find((request) => request.method === 'PATCH');
    await expect(patch?.endpoint).toBe(COMPANY_ENDPOINT);
    await expect(patch?.body).toEqual({ website: 'www.acme.example.com' });
    // A successful save re-seeds the form: the invalidation refetches the detail query.
    await expect(api.requests.at(-1)?.method).toBe('GET');
  },
};

export const GeneralInfoCancel: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('textbox', { name: 'Name' });
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    // Back on the Setup grid, not climbed out of /settings/*.
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }),
    ).toBeVisible();
    await expect(
      api.requests.some((request) => request.method === 'PATCH'),
    ).toBe(false);
  },
};

export const GeneralInfoFromGrid: Story = {
  beforeEach: () => api.install(loadsCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /^General Info/ }),
    );
    await expect(
      await canvas.findByRole('heading', { name: 'General Info' }),
    ).toBeVisible();
  },
};

export const GeneralInfoValidation: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = await canvas.findByRole('textbox', { name: 'Name' });
    await userEvent.clear(name);
    await userEvent.tab();
    await expect(await canvas.findByText('Name is required')).toBeVisible();

    const email = canvas.getByRole('textbox', { name: 'Email' });
    await userEvent.clear(email);
    await userEvent.type(email, 'not-an-email');
    await userEvent.tab();
    await expect(
      await canvas.findByText('Enter a valid email address'),
    ).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      api.requests.some((request) => request.method === 'PATCH'),
    ).toBe(false);
  },
};

export const GeneralInfoLoading: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () =>
    api.install({ [`GET ${COMPANY_ENDPOINT}`]: pendingResponse }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('status', { name: 'Loading company details' }),
    ).toBeVisible();
  },
};

export const GeneralInfoError: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () =>
    api.install({
      [`GET ${COMPANY_ENDPOINT}`]: () =>
        jsonResponse({ success: false, errors: ['Forbidden'] }, 403),
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByText(
        "You don't have access to this company's settings.",
      ),
    ).toBeVisible();
  },
};

export const GeneralInfoMissingCompany: Story = {
  args: {
    initialPath: '/settings/company/general-info',
    storyCompanyId: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        "Your session isn't linked to a company. Sign out and sign in again.",
      ),
    ).toBeVisible();
    await expect(
      canvas.queryByTestId('company-settings-form'),
    ).not.toBeInTheDocument();
    // No companyId means the query is never mounted, let alone fired.
    await expect(api.requests).toHaveLength(0);
  },
};

function setupEnvelope(data: unknown) {
  return { success: true, statusCode: 200, data, errors: [] as string[] };
}

function zoneHandlers(): ApiHandlers {
  return {
    ['GET /zone']: (request) => {
      const url = new URL(request.url);
      const isActiveParam = url.searchParams.get('isActive');
      const isActive =
        isActiveParam === 'true'
          ? true
          : isActiveParam === 'false'
            ? false
            : undefined;
      const items = zoneListItemsFixture.filter((zone) =>
        isActive === undefined ? true : zone.isActive === isActive,
      );
      return jsonResponse(
        setupEnvelope({
          items,
          page: 1,
          pageSize: 10,
          totalCount: items.length,
        }),
      );
    },
    ['GET /zone/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          zoneListItemsFixture
            .filter((zone) => (activeOnly ? zone.isActive : true))
            .map(({ id, code, name }) => ({ id, code, name })),
        ),
      );
    },
    ['POST /zone']: async (request) => {
      const body = (await request.json()) as {
        code?: string;
        name?: string;
        description?: string | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          code: body.code ?? null,
          name: body.name ?? null,
          description: body.description ?? null,
          isActive: true,
        }),
        201,
      );
    },
    ['GET /postalcode']: (request) => {
      const url = new URL(request.url);
      const isActiveParam = url.searchParams.get('isActive');
      const isActive =
        isActiveParam === 'true'
          ? true
          : isActiveParam === 'false'
            ? false
            : undefined;
      const items = postalCodeListItemsFixture.filter((item) =>
        isActive === undefined ? true : item.isActive === isActive,
      );
      return jsonResponse(
        setupEnvelope({
          items,
          page: 1,
          pageSize: 10,
          totalCount: items.length,
        }),
      );
    },
    ['GET /postalcode/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          postalCodeListItemsFixture
            .filter((item) => (activeOnly ? item.isActive : true))
            .map(({ id, postalCode, city }) => ({ id, postalCode, city })),
        ),
      );
    },
    ['POST /postalcode']: async (request) => {
      const body = (await request.json()) as {
        postalCode?: string;
        city?: string;
        state?: string | null;
        fgsSetupZoneId?: number | null;
        fgsSetupTaxId?: number | null;
        tripCharge?: number | null;
      };
      const zone = zoneListItemsFixture.find(
        (item) => item.id === body.fgsSetupZoneId,
      );
      const tax = taxLookupItemsFixture.find(
        (item) => item.id === body.fgsSetupTaxId,
      );
      return jsonResponse(
        setupEnvelope({
          id: 99,
          postalCode: body.postalCode ?? null,
          city: body.city ?? null,
          state: body.state ?? null,
          fgsSetupZoneId: body.fgsSetupZoneId ?? null,
          zoneCode: zone?.code ?? null,
          zoneName: zone?.name ?? null,
          fgsSetupTaxId: body.fgsSetupTaxId ?? null,
          taxCode: tax?.taxCode ?? null,
          taxRate: tax?.taxRate ?? null,
          tripCharge: body.tripCharge ?? null,
          isActive: true,
        }),
        201,
      );
    },
    ['GET /tax/lookup']: () => jsonResponse(setupEnvelope(taxLookupItemsFixture)),
  };
}

const loadsZones = zoneHandlers();

export const ZonePostalCode: Story = {
  args: { initialPath: '/settings/company/zone-postal-code' },
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Zone & Postal Code' }),
    ).toBeVisible();
    await expect(
      await canvas.findByText('NORTH'),
    ).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Active (5)' })).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Inactive (2)' }),
    ).toBeVisible();
  },
};

export const ZonePostalCodeInactive: Story = {
  args: { initialPath: '/settings/company/zone-postal-code' },
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('NORTH');
    await userEvent.click(canvas.getByRole('tab', { name: 'Inactive (2)' }));
    await expect(await canvas.findByText('OUTER')).toBeVisible();
    await expect(canvas.queryByText('NORTH')).not.toBeInTheDocument();
  },
};

export const ZonePostalCodeCatalog: Story = {
  args: {
    initialPath: '/settings/company/zone-postal-code?catalog=postal',
  },
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('NORTH')).toBeVisible();
    await expect(canvas.getAllByText('Houston').length).toBeGreaterThan(0);
    await expect(canvas.getByRole('tab', { name: 'Active (5)' })).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Inactive (2)' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Add Postal Code' }),
    ).toBeEnabled();
  },
};

export const ZonePostalCodeAdd: Story = {
  args: { initialPath: '/settings/company/zone-postal-code' },
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('NORTH');
    await userEvent.click(canvas.getByRole('button', { name: 'Add Zone' }));
    const dialog = await canvas.findByRole('dialog');
    const withinDialog = within(dialog);
    await userEvent.type(withinDialog.getByRole('textbox', { name: /code/i }), 'MID');
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /zone name/i }),
      'Mid Zone',
    );
    await expect(
      withinDialog.getByRole('heading', { name: 'Create Zone' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    await expect(await canvas.findByText('Zone created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/zone');
    await expect(post?.body).toEqual({
      code: 'MID',
      name: 'Mid Zone',
      description: null,
    });
  },
};

export const ZonePostalCodeAddPostal: Story = {
  args: {
    initialPath: '/settings/company/zone-postal-code?catalog=postal',
  },
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('NORTH');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Postal Code' }),
    );
    const dialog = await canvas.findByRole('dialog');
    const withinDialog = within(dialog);
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /postal code/i }),
      '77099',
    );
    await userEvent.click(
      withinDialog.getByRole('combobox', { name: /city/i }),
    );
    await userEvent.click(
      within(document.body).getByRole('option', { name: 'Houston' }),
    );
    await userEvent.click(
      withinDialog.getByRole('combobox', { name: /tax code/i }),
    );
    await userEvent.click(
      within(document.body).getByRole('option', { name: 'TX-STD' }),
    );
    await expect(
      withinDialog.getByRole('heading', { name: 'Add Postal Code' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    await expect(await canvas.findByText('Postal code created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/postalcode');
    await expect(post?.body).toEqual({
      postalCode: '77099',
      city: 'Houston',
      state: null,
      fgsSetupZoneId: null,
      fgsSetupTaxId: 11,
      tripCharge: null,
    });
  },
};

export const ZoneFromGrid: Story = {
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Operations' }));
    await userEvent.click(canvas.getByRole('button', { name: /^Zone/ }));
    await expect(
      await canvas.findByRole('heading', { name: 'Zone & Postal Code' }),
    ).toBeVisible();
  },
};

export const GeneralInfoSaveConflict: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () =>
    api.install({
      ...loadsCompany,
      [`PATCH ${COMPANY_ENDPOINT}`]: () =>
        jsonResponse({ success: false, errors: ['Conflict'] }, 409),
    }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const legalName = await canvas.findByRole('textbox', {
      name: 'Legal Name',
    });
    await userEvent.type(legalName, ' LLC');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Settings already updated by another user.'),
    ).toBeVisible();
    // Typed values survive a failed save.
    await expect(legalName).toHaveValue('Acme Field Services LLC');
  },
};
