import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configure, expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { alert } from '@cms/ui';
import type { GlBreakDetailDto } from '@cms/settings-contract';
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
  taxAuthorityListItemsFixture,
  taxListItemsFixture,
  taxLookupItemsFixture,
  techSkillLevelListItemsFixture,
  techTradeListItemsFixture,
  nonWorkingDateListItemsFixture,
  zoneListItemsFixture,
} from '../../../.storybook/fixtures/feature-data';
import { glBreakListItemsFixture } from '../../../.storybook/fixtures/gl-break-data';
import {
  STORY_COMPANY_ID,
  withCmsRuntime,
} from '../../../.storybook/fixtures/runtime';
import { App } from './App';

configure({ asyncUtilTimeout: 5000 });

const SettingsApp = withCmsRuntime(App);

const api = createStoryApi();
const COMPANY_ENDPOINT = `/company/${STORY_COMPANY_ID}`;
const NON_WORKING_DATE_ENDPOINT = '/nonworkingdate';

function setupEnvelope(data: unknown) {
  return { success: true, statusCode: 200, data, errors: [] as string[] };
}

function geoLookupHandlers(): ApiHandlers {
  const countries = [
    {
      countryCode: 'US',
      countryName: 'United States',
      currencyCode: 'USD',
    },
    {
      countryCode: 'CA',
      countryName: 'Canada',
      currencyCode: 'CAD',
    },
  ];
  const states = [
    {
      id: 1,
      countryCode: 'US',
      stateProvinceCode: 'TX',
      stateProvinceName: 'Texas',
    },
    {
      id: 2,
      countryCode: 'US',
      stateProvinceCode: 'IL',
      stateProvinceName: 'Illinois',
    },
    {
      id: 3,
      countryCode: 'CA',
      stateProvinceCode: 'ON',
      stateProvinceName: 'Ontario',
    },
  ];
  const cities = [
    { city: 'Houston', countryCode: 'US', stateProvinceCode: 'TX' },
    { city: 'Dallas', countryCode: 'US', stateProvinceCode: 'TX' },
    { city: 'Austin', countryCode: 'US', stateProvinceCode: 'TX' },
    { city: 'San Antonio', countryCode: 'US', stateProvinceCode: 'TX' },
    { city: 'Chicago', countryCode: 'US', stateProvinceCode: 'IL' },
    { city: 'Springfield', countryCode: 'US', stateProvinceCode: 'IL' },
    { city: 'Peoria', countryCode: 'US', stateProvinceCode: 'IL' },
    { city: 'Toronto', countryCode: 'CA', stateProvinceCode: 'ON' },
  ];

  return {
    ['GET /glo/country/lookup']: () => jsonResponse(setupEnvelope(countries)),
    ['GET /glo/stateprovince/lookup']: (request) => {
      const countryCode = new URL(request.url).searchParams.get('countryCode');
      const items = countryCode
        ? states.filter((state) => state.countryCode === countryCode)
        : states;
      return jsonResponse(setupEnvelope(items));
    },
    ['GET /postalcode/cities']: (request) => {
      const url = new URL(request.url);
      const countryCode = url.searchParams.get('countryCode');
      const stateProvinceCode = url.searchParams.get('stateProvinceCode');
      const items = cities
        .filter((city) => {
          if (countryCode && city.countryCode !== countryCode) return false;
          if (
            stateProvinceCode &&
            city.stateProvinceCode !== stateProvinceCode
          ) {
            return false;
          }
          return true;
        })
        .map(({ city }) => ({ city }));
      return jsonResponse(setupEnvelope(items));
    },
  };
}

async function fillTextbox(element: HTMLElement, value: string) {
  await userEvent.click(element);
  await fireEvent.input(element, { target: { value } });
}

function nonWorkingDateHandlers(): ApiHandlers {
  return {
    [`GET ${NON_WORKING_DATE_ENDPOINT}`]: () =>
      jsonResponse(
        setupEnvelope({
          items: nonWorkingDateListItemsFixture,
          page: 1,
          pageSize: 10,
          totalCount: nonWorkingDateListItemsFixture.length,
        }),
      ),
    [`POST ${NON_WORKING_DATE_ENDPOINT}`]: async (request) => {
      const body = (await request.json()) as {
        name?: string | null;
        nonWorkingDate?: string;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          nonWorkingDate: body.nonWorkingDate ?? '2025-02-17',
          name: body.name ?? null,
          isActive: true,
        }),
        201,
      );
    },
    [`PUT ${NON_WORKING_DATE_ENDPOINT}/41`]: async (request) => {
      const body = (await request.json()) as {
        name?: string | null;
        nonWorkingDate?: string;
      };
      return jsonResponse(
        setupEnvelope({
          id: 41,
          nonWorkingDate: body.nonWorkingDate ?? '2025-01-01',
          name: body.name ?? "New Year's Day",
          isActive: true,
        }),
      );
    },
    [`DELETE ${NON_WORKING_DATE_ENDPOINT}/41`]: () =>
      new Response(null, { status: 204 }),
  };
}

/**
 * Stories drive the screen through `customFetch`, not through injected loader props —
 * so the Zod parse, the mappers and the PATCH body are all part of what is asserted.
 * The handler keys mirror `companyDetailEndpoint()`.
 */
const loadsNonWorkingDates = nonWorkingDateHandlers();

const loadsCompany: ApiHandlers = {
  [`GET ${COMPANY_ENDPOINT}`]: () => jsonResponse(companyResponseFixture),
  ...loadsNonWorkingDates,
  ...geoLookupHandlers(),
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

const LAZY_PAGE = { timeout: 10_000 } as const;

const findDialog = async () => {
  const dialog = await within(document.body).findByRole(
    'dialog',
    {},
    LAZY_PAGE,
  );
  await waitFor(() => expect(dialog).toBeVisible(), LAZY_PAGE);
  return dialog;
};

const chooseSelectOption = async (
  scope: ReturnType<typeof within>,
  fieldName: RegExp,
  optionName: string,
) => {
  await userEvent.click(scope.getByRole('combobox', { name: fieldName }));
  await userEvent.click(
    await within(document.body).findByRole('option', { name: optionName }),
  );
  await waitFor(() => {
    expect(scope.getByRole('combobox', { name: fieldName })).toHaveTextContent(
      optionName,
    );
  });
};

const waitForEnabledCombobox = (
  scope: ReturnType<typeof within>,
  fieldName: RegExp,
) =>
  waitFor(() => {
    expect(scope.getByRole('combobox', { name: fieldName })).toBeEnabled();
  }, LAZY_PAGE);

const waitForDialogClosed = () =>
  waitFor(() => {
    expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  }, LAZY_PAGE);

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }, LAZY_PAGE),
    ).toBeVisible();
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
    await userEvent.click(
      await canvas.findByRole('tab', { name: 'Users & Payroll' }, LAZY_PAGE),
    );
    await expect(canvas.getByRole('button', { name: /^Roles/ })).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^General Info/ }),
    ).not.toBeInTheDocument();
  },
};

export const SearchFilter: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      await canvas.findByLabelText('Search settings', {}, LAZY_PAGE),
      'tax',
    );
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
      await canvas.findByLabelText('Search settings', {}, LAZY_PAGE),
      'zzz-no-match',
    );
    await expect(
      canvas.getByText('No settings match "zzz-no-match"'),
    ).toBeVisible();
  },
};

export const SearchMatchesOtherTab: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      await canvas.findByLabelText('Search settings', {}, LAZY_PAGE),
      'trade',
    );
    await expect(
      canvas.getByText('No settings match "trade" in Company. Try another tab:'),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Operations (1)' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Operations (1)' }));
    await expect(
      canvas.getByRole('button', { name: /^Trade & Skills/ }),
    ).toBeVisible();
  },
};

export const GeneralInfo: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(loadsCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('textbox', { name: 'Name' }, LAZY_PAGE),
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
    await expect(await canvas.findByText("New Year's Day")).toBeVisible();
    await expect(canvas.getByText('01/01/2025')).toBeVisible();
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
    const website = await canvas.findByRole('textbox', {
      name: 'Website',
    }, LAZY_PAGE);
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
    await canvas.findByRole('textbox', { name: 'Name' }, LAZY_PAGE);
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    // Back on the Setup grid, not climbed out of /settings/*.
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }, LAZY_PAGE),
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
      await canvas.findByRole('button', { name: /^General Info/ }, LAZY_PAGE),
    );
    await expect(
      await canvas.findByRole('heading', { name: 'General Info' }),
    ).toBeVisible();
  },
};

export const GeneralInfoCompanyBreadcrumb: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(loadsCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('heading', { name: 'General Info' });
    await userEvent.click(canvas.getByRole('link', { name: 'Company' }));
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }),
    ).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Company' })).toHaveAttribute(
      'data-active',
      '',
    );
    await expect(
      canvas.getByRole('button', { name: /^General Info/ }),
    ).toBeVisible();
  },
};

export const GeneralInfoValidation: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = await canvas.findByRole(
      'textbox',
      { name: 'Name' },
      LAZY_PAGE,
    );
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
      await canvas.findByRole(
        'status',
        { name: 'Loading company details' },
        LAZY_PAGE,
      ),
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
        {},
        LAZY_PAGE,
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
      await canvas.findByText(
        "Your session isn't linked to a company. Sign out and sign in again.",
        {},
        LAZY_PAGE,
      ),
    ).toBeVisible();
    await expect(
      canvas.queryByTestId('company-settings-form'),
    ).not.toBeInTheDocument();
    // No companyId means the query is never mounted, let alone fired.
    await expect(api.requests).toHaveLength(0);
  },
};

function zoneHandlers(): ApiHandlers {
  return {
    ...geoLookupHandlers(),
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
        stateProvinceCode?: string | null;
        countryCode?: string | null;
        fgsSetupZoneId?: number | null;
        fgsSetupTaxId?: number | null;
        tripChargeAmount?: number | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          postalCode: body.postalCode ?? null,
          countryCode: body.countryCode ?? null,
          stateProvinceCode: body.stateProvinceCode ?? null,
          city: body.city ?? null,
          tripChargeAmount: body.tripChargeAmount ?? null,
          fgsSetupZoneId: body.fgsSetupZoneId ?? null,
          fgsSetupTaxId: body.fgsSetupTaxId ?? null,
          isActive: true,
        }),
        201,
      );
    },
    ['GET /tax/lookup']: () =>
      jsonResponse(setupEnvelope(taxLookupItemsFixture)),
  };
}

const loadsZones = zoneHandlers();

type StoryGlBreak = GlBreakDetailDto;

const GL_BREAK_ID_ROUTE = /^(GET|PUT|PATCH) \/glbreak\/(\d+)$/;

function glBreakHandlers(): ApiHandlers {
  const items: StoryGlBreak[] = glBreakListItemsFixture.map((item) => ({
    ...item,
    trades: [],
  }));

  const filterItems = (request: Request) => {
    const url = new URL(request.url);
    const isActiveParam = url.searchParams.get('isActive');
    const isActive =
      isActiveParam === 'true'
        ? true
        : isActiveParam === 'false'
          ? false
          : undefined;
    const breakLevelRaw = url.searchParams.get('breakLevel');
    const breakLevel =
      breakLevelRaw === null || breakLevelRaw === ''
        ? undefined
        : Number(breakLevelRaw);
    return items.filter((item) => {
      if (isActive !== undefined && item.isActive !== isActive) return false;
      if (breakLevel !== undefined && item.breakLevel !== breakLevel) {
        return false;
      }
      return true;
    });
  };

  const handlers: ApiHandlers = {
    ...geoLookupHandlers(),
    ['GET /glbreak']: (request) => {
      const matched = filterItems(request);
      return jsonResponse(
        setupEnvelope({
          items: matched,
          page: 1,
          pageSize: 10,
          totalCount: matched.length,
        }),
      );
    },
    ['GET /glbreak/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          items
            .filter((item) => (activeOnly ? item.isActive : true))
            .map(({ id, code, name, breakLevel }) => ({
              id,
              code,
              name,
              breakLevel,
            })),
        ),
      );
    },
    ['GET /techtrade/lookup']: () =>
      jsonResponse(
        setupEnvelope([
          { id: 51, tradeCode: 'HVAC', name: 'HVAC', sortOrder: 1 },
          { id: 52, tradeCode: 'PLUMB', name: 'Plumbing', sortOrder: 2 },
          { id: 53, tradeCode: 'ELEC', name: 'Electrical', sortOrder: 3 },
        ]),
      ),
    ['POST /glbreak']: async (request) => {
      const body = (await request.json()) as {
        code?: string | null;
        name?: string | null;
        breakLabel?: string | null;
        breakLevel: number;
        logoFileId?: number | null;
        address?: StoryGlBreak['address'] | null;
        tradeCodes?: string[] | null;
      };
      const created: StoryGlBreak = {
        id: 99,
        code: body.code ?? null,
        name: body.name ?? null,
        breakLabel: body.breakLabel ?? null,
        breakLevel: body.breakLevel,
        logoFileId: body.logoFileId ?? null,
        isActive: true,
        address: body.address
          ? {
              id: 'aaaaaaaa-bbbb-cccc-dddd-000000000099',
              addressLine1: body.address.addressLine1 ?? null,
              addressLine2: body.address.addressLine2 ?? null,
              addressLine3: body.address.addressLine3 ?? null,
              addressLine4: body.address.addressLine4 ?? null,
              city: body.address.city ?? null,
              state: body.address.state ?? null,
              country: body.address.country ?? null,
              postalCode: body.address.postalCode ?? null,
              formattedAddress: body.address.formattedAddress ?? null,
              latitude: body.address.latitude ?? null,
              longitude: body.address.longitude ?? null,
            }
          : null,
        trades: (body.tradeCodes ?? []).map((tradeCode, index) => ({
          id: 900 + index,
          tradeCode,
        })),
      };
      items.push(created);
      return jsonResponse(setupEnvelope(created), 201);
    },
  };

  return new Proxy(handlers, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        const match = GL_BREAK_ID_ROUTE.exec(prop);
        if (match) {
          const method = match[1];
          const id = Number(match[2]);
          return async (request: Request) => {
            const record = items.find((item) => item.id === id);
            if (!record) {
              return jsonResponse(
                { success: false, errors: ['GL break not found.'] },
                404,
              );
            }
            if (method === 'GET') {
              return jsonResponse(setupEnvelope(record));
            }
            const body = (await request.json()) as Partial<StoryGlBreak> & {
              tradeCodes?: string[] | null;
            };
            Object.assign(record, body);
            if (body.tradeCodes !== undefined) {
              record.trades = (body.tradeCodes ?? []).map(
                (tradeCode, index) => ({
                  id: record.trades?.[index]?.id ?? 900 + index,
                  tradeCode,
                }),
              );
            }
            return jsonResponse(setupEnvelope(record));
          };
        }
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

const loadsGlBreaks = glBreakHandlers();

export const ZonePostalCode: Story = {
  args: { initialPath: '/settings/company/zone-postal-code' },
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole(
        'heading',
        { name: 'Zone & Postal Code' },
        LAZY_PAGE,
      ),
    ).toBeVisible();
    await expect(
      await canvas.findByRole('tab', { name: 'Active (5)' }),
    ).toBeVisible();
    await expect(await canvas.findByText('NORTH')).toBeVisible();
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
    await expect(
      await canvas.findByRole('tab', { name: 'Active (5)' }),
    ).toBeVisible();
    await expect(await canvas.findByText('NORTH')).toBeVisible();
    await expect(canvas.getAllByText('Houston').length).toBeGreaterThan(0);
    await expect(canvas.getAllByText('TX').length).toBeGreaterThan(0);
    await expect(canvas.getByText('North Zone')).toBeVisible();
    await expect(canvas.getAllByText('$10.00').length).toBeGreaterThan(0);
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
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('NORTH');
    await userEvent.click(canvas.getByRole('button', { name: 'Add Zone' }));
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /code/i }),
      'MID',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /zone name/i }),
      'Mid Zone',
    );
    await expect(
      withinDialog.getByRole('heading', { name: 'Create Zone' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Zone created')).toBeVisible();
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
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('NORTH');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Postal Code' }),
    );
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /postal code/i }),
      '77099',
    );
    await chooseSelectOption(withinDialog, /country/i, 'United States');
    await waitForEnabledCombobox(withinDialog, /state/i);
    await chooseSelectOption(withinDialog, /state/i, 'Texas');
    await waitForEnabledCombobox(withinDialog, /^city$/i);
    await chooseSelectOption(withinDialog, /^city$/i, 'Houston');
    await chooseSelectOption(withinDialog, /tax code/i, 'TX-STD');
    await expect(
      withinDialog.getByRole('heading', { name: 'Add Postal Code' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Postal code created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/postalcode');
    await expect(post?.body).toEqual({
      postalCode: '77099',
      countryCode: 'US',
      stateProvinceCode: 'TX',
      city: 'Houston',
      tripChargeAmount: null,
      fgsSetupZoneId: null,
      fgsSetupTaxId: 11,
    });
  },
};

export const ZoneFromGrid: Story = {
  beforeEach: () => api.install(loadsZones),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole('tab', { name: 'Operations' }, LAZY_PAGE),
    );
    await userEvent.click(canvas.getByRole('button', { name: /^Zone/ }));
    await expect(
      await canvas.findByRole(
        'heading',
        { name: 'Zone & Postal Code' },
        LAZY_PAGE,
      ),
    ).toBeVisible();
  },
};

export const BusinessUnit: Story = {
  args: { initialPath: '/settings/company/business-unit' },
  beforeEach: () => api.install(loadsGlBreaks),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole(
        'heading',
        { name: 'Business Units & Break 2' },
        LAZY_PAGE,
      ),
    ).toBeVisible();
    await waitFor(() => {
      expect(canvas.getByText('LOC-1001')).toBeVisible();
    }, LAZY_PAGE);
    await expect(canvas.getByRole('tab', { name: 'Active (5)' })).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Inactive (2)' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Add Business Unit' }),
    ).toBeEnabled();
  },
};

export const BusinessUnitInactive: Story = {
  args: { initialPath: '/settings/company/business-unit' },
  beforeEach: () => api.install(loadsGlBreaks),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('LOC-1001', {}, LAZY_PAGE);
    await userEvent.click(canvas.getByRole('tab', { name: 'Inactive (2)' }));
    await expect(await canvas.findByText('LOC-1008')).toBeVisible();
    await expect(canvas.queryByText('LOC-1001')).not.toBeInTheDocument();
  },
};

export const BusinessUnitCatalog: Story = {
  args: {
    initialPath: '/settings/company/business-unit?catalog=break2',
  },
  beforeEach: () => api.install(loadsGlBreaks),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.getByText('BR2-2001')).toBeVisible();
    }, LAZY_PAGE);
    await expect(canvas.getByRole('tab', { name: 'Active (5)' })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Add Break 2' }),
    ).toBeEnabled();
  },
};

export const BusinessUnitAdd: Story = {
  args: { initialPath: '/settings/company/business-unit' },
  beforeEach: () => api.install(loadsGlBreaks),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('LOC-1001', {}, LAZY_PAGE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Business Unit' }),
    );
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /business unit name/i }),
      'Mid Unit',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /^code/i }),
      'MID',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /address line 1/i }),
      '100 Main St',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /zip\/postal code/i }),
      '62701',
    );
    await chooseSelectOption(withinDialog, /country/i, 'United States');
    await waitForEnabledCombobox(withinDialog, /state/i);
    await chooseSelectOption(withinDialog, /state/i, 'Illinois');
    await waitForEnabledCombobox(withinDialog, /^city$/i);
    await chooseSelectOption(withinDialog, /^city$/i, 'Springfield');
    await expect(
      withinDialog.getByRole('heading', { name: 'Create Business Unit' }),
    ).toBeVisible();
    await userEvent.click(
      withinDialog.getByRole('button', { name: 'Save Business Unit' }),
    );
    await waitForDialogClosed();
    await expect(
      await canvas.findByText('Business unit created'),
    ).toBeVisible();
    await expect(await canvas.findByText('MID')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/glbreak');
    await expect(post?.body).toEqual({
      code: 'MID',
      name: 'Mid Unit',
      breakLabel: null,
      breakLevel: 1,
      logoFileId: null,
      address: {
        addressLine1: '100 Main St',
        addressLine2: null,
        addressLine3: null,
        addressLine4: null,
        city: 'Springfield',
        state: 'IL',
        county: null,
        country: 'US',
        postalCode: '62701',
        formattedAddress: '100 Main St, Springfield, IL 62701',
        latitude: null,
        longitude: null,
        placeId: null,
      },
      tradeCodes: null,
    });
    const postIndex = api.requests.findIndex(
      (request) => request.method === 'POST',
    );
    await expect(
      api.requests.slice(postIndex + 1).some(
        (request) =>
          request.method === 'GET' && request.endpoint === '/glbreak',
      ),
    ).toBe(true);
  },
};

export const BusinessUnitAddBreak2: Story = {
  args: {
    initialPath: '/settings/company/business-unit?catalog=break2',
  },
  beforeEach: () => api.install(loadsGlBreaks),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('BR2-2001', {}, LAZY_PAGE);
    await userEvent.click(canvas.getByRole('button', { name: 'Add Break 2' }));
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Create Break 2' }),
    ).toBeVisible();
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /^name/i }),
      'West Region',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /^code/i }),
      'BR2-2010',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /address line 1/i }),
      '200 West Ave',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /zip\/postal code/i }),
      '61602',
    );
    await chooseSelectOption(withinDialog, /country/i, 'United States');
    await waitForEnabledCombobox(withinDialog, /state/i);
    await chooseSelectOption(withinDialog, /state/i, 'Illinois');
    await waitForEnabledCombobox(withinDialog, /^city$/i);
    await chooseSelectOption(withinDialog, /^city$/i, 'Peoria');
    await userEvent.click(
      withinDialog.getByRole('button', { name: 'Save Break 2' }),
    );
    await waitForDialogClosed();
    await expect(await canvas.findByText('Break 2 created')).toBeVisible();
    await expect(await canvas.findByText('BR2-2010')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/glbreak');
    await expect(post?.body).toEqual(
      expect.objectContaining({
        code: 'BR2-2010',
        name: 'West Region',
        breakLevel: 2,
      }),
    );
  },
};

export const BusinessUnitFromGrid: Story = {
  beforeEach: () => api.install(loadsGlBreaks),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole(
        'button',
        { name: /^Business Unit/ },
        LAZY_PAGE,
      ),
    );
    await expect(
      await canvas.findByRole('heading', { name: 'Business Units & Break 2' }),
    ).toBeVisible();
  },
};

function tradeSkillsHandlers(): ApiHandlers {
  return {
    ['GET /techtrade']: (request) => {
      const url = new URL(request.url);
      const isActiveParam = url.searchParams.get('isActive');
      const isActive =
        isActiveParam === 'true'
          ? true
          : isActiveParam === 'false'
            ? false
            : undefined;
      const items = techTradeListItemsFixture.filter((item) =>
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
    ['GET /techtrade/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          techTradeListItemsFixture
            .filter((item) => (activeOnly ? item.isActive : true))
            .map(({ id, tradeCode, name, sortOrder }) => ({
              id,
              tradeCode,
              name,
              sortOrder,
            })),
        ),
      );
    },
    ['POST /techtrade']: async (request) => {
      const body = (await request.json()) as {
        tradeCode?: string | null;
        name?: string | null;
        description?: string | null;
        sortOrder?: number | null;
        skillIds?: number[] | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          tradeCode: body.tradeCode ?? null,
          name: body.name ?? null,
          description: body.description ?? null,
          sortOrder: body.sortOrder ?? null,
          skillIds: body.skillIds ?? [],
          isActive: true,
        }),
        201,
      );
    },
    ['PUT /techtrade/51']: async (request) => {
      const body = (await request.json()) as {
        tradeCode?: string | null;
        name?: string | null;
        description?: string | null;
        sortOrder?: number | null;
        skillIds?: number[] | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 51,
          tradeCode: body.tradeCode ?? 'HVAC',
          name: body.name ?? 'HVAC- Repair',
          description: body.description ?? null,
          sortOrder: body.sortOrder ?? 1,
          skillIds: body.skillIds ?? [61, 62],
          isActive: true,
        }),
      );
    },
    ['DELETE /techtrade/52']: () => new Response(null, { status: 204 }),
    ['GET /techskilllevel']: (request) => {
      const url = new URL(request.url);
      const isActiveParam = url.searchParams.get('isActive');
      const isActive =
        isActiveParam === 'true'
          ? true
          : isActiveParam === 'false'
            ? false
            : undefined;
      const items = techSkillLevelListItemsFixture.filter((item) =>
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
    ['GET /techskilllevel/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          techSkillLevelListItemsFixture
            .filter((item) => (activeOnly ? item.isActive : true))
            .map(({ id, code, name, sortOrder }) => ({
              id,
              code,
              name,
              sortOrder,
            })),
        ),
      );
    },
    ['POST /techskilllevel']: async (request) => {
      const body = (await request.json()) as {
        code?: string | null;
        name?: string | null;
        description?: string | null;
        sortOrder?: number | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          code: body.code ?? null,
          name: body.name ?? null,
          description: body.description ?? null,
          sortOrder: body.sortOrder ?? null,
          isActive: true,
        }),
        201,
      );
    },
    ['PUT /techskilllevel/61']: async (request) => {
      const body = (await request.json()) as {
        code?: string | null;
        name?: string | null;
        description?: string | null;
        sortOrder?: number | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 61,
          code: body.code ?? 'INST',
          name: body.name ?? 'Install',
          description: body.description ?? null,
          sortOrder: body.sortOrder ?? 1,
          isActive: true,
        }),
      );
    },
    ['DELETE /techskilllevel/62']: () => new Response(null, { status: 204 }),
  };
}

const loadsTradeSkills = tradeSkillsHandlers();

export const TradeSkills: Story = {
  args: { initialPath: '/settings/operations/trade-skills' },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Trade & Skills' }),
    ).toBeVisible();
    await expect(
      await canvas.findByRole('tab', { name: 'Active (5)' }),
    ).toBeVisible();
    await expect(await canvas.findByText('HVAC- Repair')).toBeVisible();
    await expect(
      (await canvas.findAllByText('Install, Repair')).length,
    ).toBeGreaterThan(0);
    await expect(
      canvas.getByRole('tab', { name: 'Inactive (2)' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Add Trade' }),
    ).toBeEnabled();
  },
};

export const TradeSkillsInactive: Story = {
  args: { initialPath: '/settings/operations/trade-skills' },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('HVAC- Repair');
    await userEvent.click(canvas.getByRole('tab', { name: 'Inactive (2)' }));
    await expect(await canvas.findByText('Appliance')).toBeVisible();
    await expect(canvas.queryByText('HVAC- Repair')).not.toBeInTheDocument();
  },
};

export const TradeSkillsAdd: Story = {
  args: { initialPath: '/settings/operations/trade-skills' },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('HVAC- Repair');
    await userEvent.click(canvas.getByRole('button', { name: 'Add Trade' }));
    const dialog = await within(document.body).findByRole('dialog');
    const withinDialog = within(dialog);
    const tradeCode = withinDialog.getByRole('textbox', { name: /trade code/i });
    const name = withinDialog.getByRole('textbox', { name: /^name/i });
    await fillTextbox(tradeCode, 'GAS');
    await fillTextbox(name, 'Gas Fitting');
    await expect(tradeCode).toHaveValue('GAS');
    await expect(name).toHaveValue('Gas Fitting');
    await userEvent.click(
      withinDialog.getByRole('combobox', { name: /skills/i }),
    );
    await userEvent.click(
      await within(document.body).findByRole('option', { name: 'Install' }),
    );
    await userEvent.click(
      within(document.body).getByRole('option', { name: 'Repair' }),
    );
    await userEvent.keyboard('{Escape}');
    await expect(
      withinDialog.getByRole('heading', { name: 'Add Trade' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Trade created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/techtrade');
    await expect(post?.body).toEqual({
      tradeCode: 'GAS',
      name: 'Gas Fitting',
      description: null,
      skillIds: [61, 62],
    });
  },
};

export const TradeSkillsEdit: Story = {
  args: { initialPath: '/settings/operations/trade-skills' },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('HVAC- Repair');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit HVAC- Repair' }),
    );
    const dialog = await within(document.body).findByRole('dialog');
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Edit Trade' }),
    ).toBeVisible();
    const name = withinDialog.getByRole('textbox', { name: /^name/i });
    await fillTextbox(name, 'HVAC Repair');
    await expect(name).toHaveValue('HVAC Repair');
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Trade updated')).toBeVisible();
    const put = api.requests.find((request) => request.method === 'PUT');
    await expect(put?.endpoint).toBe('/techtrade/51');
  },
};

export const TradeSkillsDelete: Story = {
  args: { initialPath: '/settings/operations/trade-skills' },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('Plumbing -Install');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Delete Plumbing -Install' }),
    );
    const dialog = await within(document.body).findByRole('dialog');
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Delete Trade' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Delete' }));
    const body = within(document.body);
    await expect(await body.findByText('Deleted')).toBeVisible();
    await expect(body.getByText('Trade deleted')).toBeVisible();
    const del = api.requests.find((request) => request.method === 'DELETE');
    await expect(del?.endpoint).toBe('/techtrade/52');
  },
};

export const TradeSkillsFromGrid: Story = {
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Operations' }));
    await userEvent.click(
      canvas.getByRole('button', { name: /^Trade & Skills/ }),
    );
    await expect(
      await canvas.findByRole('heading', { name: 'Trade & Skills' }),
    ).toBeVisible();
  },
};

export const TradeSkillsOperationsBreadcrumb: Story = {
  args: { initialPath: '/settings/operations/trade-skills' },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('heading', { name: 'Trade & Skills' });
    await expect(canvas.getByRole('link', { name: 'Setup' })).toBeVisible();
    await userEvent.click(canvas.getByRole('link', { name: 'Operations' }));
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Operations' }),
    ).toHaveAttribute('data-active', '');
    await expect(
      canvas.getByRole('button', { name: /^Trade & Skills/ }),
    ).toBeVisible();
  },
};

export const TradeSkillsCatalog: Story = {
  args: {
    initialPath: '/settings/operations/trade-skills?catalog=skills',
  },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Trade & Skills' }),
    ).toBeVisible();
    await expect(
      await canvas.findByRole('tab', { name: 'Active (5)' }),
    ).toBeVisible();
    await expect(await canvas.findByText('Install')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Add Skill' }),
    ).toBeEnabled();
  },
};

export const TradeSkillsCatalogInactive: Story = {
  args: {
    initialPath: '/settings/operations/trade-skills?catalog=skills',
  },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Install');
    await userEvent.click(canvas.getByRole('tab', { name: 'Inactive (3)' }));
    await expect(await canvas.findByText('Weld')).toBeVisible();
    await expect(canvas.queryByText('Install')).not.toBeInTheDocument();
  },
};

export const TradeSkillsAddSkill: Story = {
  args: {
    initialPath: '/settings/operations/trade-skills?catalog=skills',
  },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('Install');
    await userEvent.click(canvas.getByRole('button', { name: 'Add Skill' }));
    const dialog = await within(document.body).findByRole('dialog');
    const withinDialog = within(dialog);
    const code = withinDialog.getByRole('textbox', { name: /skill code/i });
    const name = withinDialog.getByRole('textbox', { name: /^name/i });
    await fillTextbox(code, 'CAL');
    await fillTextbox(name, 'Calibrate');
    await expect(code).toHaveValue('CAL');
    await expect(name).toHaveValue('Calibrate');
    await expect(
      withinDialog.getByRole('heading', { name: 'Add Skill' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Skill created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/techskilllevel');
    await expect(post?.body).toEqual({
      code: 'CAL',
      name: 'Calibrate',
      description: null,
    });
  },
};

export const TradeSkillsEditSkill: Story = {
  args: {
    initialPath: '/settings/operations/trade-skills?catalog=skills',
  },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('Install');
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Install' }));
    const dialog = await within(document.body).findByRole('dialog');
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Edit Skill' }),
    ).toBeVisible();
    const name = withinDialog.getByRole('textbox', { name: /^name/i });
    await fillTextbox(name, 'Installation');
    await expect(name).toHaveValue('Installation');
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Skill updated')).toBeVisible();
    const put = api.requests.find((request) => request.method === 'PUT');
    await expect(put?.endpoint).toBe('/techskilllevel/61');
  },
};

export const TradeSkillsDeleteSkill: Story = {
  args: {
    initialPath: '/settings/operations/trade-skills?catalog=skills',
  },
  beforeEach: () => api.install(loadsTradeSkills),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('Repair');
    await userEvent.click(canvas.getByRole('button', { name: 'Delete Repair' }));
    const dialog = await within(document.body).findByRole('dialog');
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Delete Skill' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Delete' }));
    const body = within(document.body);
    await expect(await body.findByText('Deleted')).toBeVisible();
    await expect(body.getByText('Skill deleted')).toBeVisible();
    const del = api.requests.find((request) => request.method === 'DELETE');
    await expect(del?.endpoint).toBe('/techskilllevel/62');
  },
};

function taxSetupHandlers(): ApiHandlers {
  return {
    ...geoLookupHandlers(),
    ['GET /taxauthority']: (request) => {
      const url = new URL(request.url);
      const isActiveParam = url.searchParams.get('isActive');
      const isActive =
        isActiveParam === 'true'
          ? true
          : isActiveParam === 'false'
            ? false
            : undefined;
      const items = taxAuthorityListItemsFixture.filter((item) =>
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
    ['GET /taxauthority/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          taxAuthorityListItemsFixture
            .filter((item) => (activeOnly ? item.isActive : true))
            .map(({ id, code, name, taxPercent }) => ({
              id,
              code,
              name,
              taxPercent,
            })),
        ),
      );
    },
    ['POST /taxauthority']: async (request) => {
      const body = (await request.json()) as {
        code?: string;
        name?: string;
        regionCode?: string | null;
        isExternalSystemRecord?: boolean;
        taxPercent?: number;
        description?: string | null;
        effectiveFromDate?: string | null;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          code: body.code ?? null,
          name: body.name ?? null,
          regionCode: body.regionCode ?? null,
          isExternalSystemRecord: body.isExternalSystemRecord ?? false,
          taxPercent: body.taxPercent ?? 0,
          description: body.description ?? null,
          effectiveFromDate: body.effectiveFromDate ?? null,
          usageCount: 0,
          isActive: true,
        }),
        201,
      );
    },
    ['GET /tax']: (request) => {
      const url = new URL(request.url);
      const isActiveParam = url.searchParams.get('isActive');
      const isActive =
        isActiveParam === 'true'
          ? true
          : isActiveParam === 'false'
            ? false
            : undefined;
      const items = taxListItemsFixture.filter((item) =>
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
    ['GET /tax/lookup']: (request) => {
      const url = new URL(request.url);
      const activeOnly = url.searchParams.get('activeOnly') !== 'false';
      return jsonResponse(
        setupEnvelope(
          taxListItemsFixture
            .filter((item) => (activeOnly ? item.isActive : true))
            .map(({ id, taxCode, name, taxRate }) => ({
              id,
              taxCode,
              name,
              taxRate,
            })),
        ),
      );
    },
    ['POST /tax']: async (request) => {
      const body = (await request.json()) as {
        taxCode?: string;
        name?: string;
        description?: string | null;
        showTaxDetail?: boolean;
        regionCode?: string | null;
        county?: string | null;
        city?: string | null;
        taxRate?: number;
      };
      return jsonResponse(
        setupEnvelope({
          id: 99,
          taxCode: body.taxCode ?? null,
          name: body.name ?? null,
          showTaxDetail: body.showTaxDetail ?? false,
          description: body.description ?? null,
          regionCode: body.regionCode ?? null,
          county: body.county ?? null,
          city: body.city ?? null,
          taxRate: body.taxRate ?? 0,
          isActive: true,
        }),
        201,
      );
    },
  };
}

const loadsTaxSetup = taxSetupHandlers();

export const TaxSetupCompanyBreadcrumb: Story = {
  args: { initialPath: '/settings/company/tax' },
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('heading', { name: 'Tax Setup' });
    await userEvent.click(canvas.getByRole('link', { name: 'Company' }));
    await expect(
      await canvas.findByRole('heading', { name: 'Setup' }),
    ).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Company' })).toHaveAttribute(
      'data-active',
      '',
    );
    await expect(
      canvas.getByRole('button', { name: /^Tax & States/ }),
    ).toBeVisible();
  },
};

export const TaxSetup: Story = {
  args: { initialPath: '/settings/company/tax' },
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Tax Setup' }, LAZY_PAGE),
    ).toBeVisible();
    await expect(
      await canvas.findByRole('tab', { name: 'Active (6)' }),
    ).toBeVisible();
    await expect(
      await canvas.findByText('Sales Tax – Harris County'),
    ).toBeVisible();
    await expect(canvas.getByText('01/23/2026')).toBeVisible();
    await expect(
      canvas.getByRole('columnheader', { name: 'Effective From' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Inactive (2)' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Assign Authority' }),
    ).toBeEnabled();
    await expect(
      canvas.getByRole('searchbox', { name: 'Search tax rates...' }),
    ).toBeVisible();
  },
};

export const TaxSetupInactive: Story = {
  args: { initialPath: '/settings/company/tax' },
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Sales Tax – Harris County');
    await userEvent.click(canvas.getByRole('tab', { name: 'Inactive (2)' }));
    await expect(await canvas.findByText('Oklahoma State')).toBeVisible();
    await expect(
      canvas.queryByText('Sales Tax – Harris County'),
    ).not.toBeInTheDocument();
  },
};

export const TaxSetupCatalog: Story = {
  args: { initialPath: '/settings/company/tax?catalog=tax-code' },
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('tab', { name: 'Active (2)' }),
    ).toBeVisible();
    await expect(
      await canvas.findByText('Sales Tax – Harris County'),
    ).toBeVisible();
    await expect(
      canvas.getByRole('columnheader', { name: 'Tax Name' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('columnheader', { name: 'State / Province' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('columnheader', { name: 'County' }),
    ).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: 'City' })).toBeVisible();
    await expect(
      canvas.getByRole('columnheader', { name: 'Status' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('tab', { name: 'Inactive (1)' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Add Tax Code' }),
    ).toBeEnabled();
    await expect(
      canvas.getByRole('searchbox', { name: 'Search tax codes...' }),
    ).toBeVisible();
  },
};

export const TaxSetupAddTaxRate: Story = {
  args: { initialPath: '/settings/company/tax?catalog=tax-code' },
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('Sales Tax – Harris County');
    await userEvent.click(canvas.getByRole('button', { name: 'Add Tax Code' }));
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /tax code/i }),
      'TX-BEXAR',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /tax rate/i }),
      '8.25',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /^name$/i }),
      'Bexar Sales Tax',
    );
    await chooseSelectOption(withinDialog, /state/i, 'Texas');
    await waitForEnabledCombobox(withinDialog, /^city$/i);
    await chooseSelectOption(withinDialog, /^city$/i, 'San Antonio');
    await expect(
      withinDialog.getByRole('heading', { name: 'Add Tax Rate' }),
    ).toBeVisible();
    await userEvent.click(
      withinDialog.getByRole('button', { name: 'Save Tax Rate' }),
    );
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Tax rate created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/tax');
    await expect(post?.body).toEqual({
      taxCode: 'TX-BEXAR',
      name: 'Bexar Sales Tax',
      isExternalSystemRecord: false,
      externalSystemId: null,
      syncToken: null,
      showTaxDetail: true,
      description: null,
      regionCode: 'TX',
      county: null,
      city: 'San Antonio',
      taxRate: 8.25,
    });
  },
};

export const TaxSetupAssignAuthority: Story = {
  args: { initialPath: '/settings/company/tax' },
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await canvas.findByText('Sales Tax – Harris County');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Assign Authority' }),
    );
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /tax authority/i }),
      'Sales Tax – Bexar County',
    );
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /rate/i }),
      '8.25',
    );
    await userEvent.type(
      withinDialog.getByLabelText(/effective date/i),
      '2026-01-23',
    );
    await expect(
      withinDialog.getByRole('heading', { name: 'Add Taxing Authority' }),
    ).toBeVisible();
    await userEvent.click(
      withinDialog.getByRole('button', { name: 'Save Tax Rate' }),
    );
    const body = within(document.body);
    await expect(await body.findByText('Saved')).toBeVisible();
    await expect(body.getByText('Tax authority created')).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe('/taxauthority');
    await expect(post?.body).toEqual({
      code: 'SALES-TAX-BEXAR-COUNTY',
      name: 'Sales Tax – Bexar County',
      regionCode: null,
      isExternalSystemRecord: false,
      taxPercent: 8.25,
      description: null,
      effectiveFromDate: '2026-01-23',
    });
  },
};

export const TaxFromGrid: Story = {
  beforeEach: () => api.install(loadsTaxSetup),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole('button', { name: /^Tax & States/ }, LAZY_PAGE),
    );
    await expect(
      await canvas.findByRole('heading', { name: 'Tax Setup' }, LAZY_PAGE),
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
    const legalName = await canvas.findByRole(
      'textbox',
      { name: 'Legal Name' },
      LAZY_PAGE,
    );
    await userEvent.type(legalName, ' LLC');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Settings already updated by another user.'),
    ).toBeVisible();
    // Typed values survive a failed save.
    await expect(legalName).toHaveValue('Acme Field Services LLC');
  },
};

function nonWorkingDateListGets() {
  return api.requests.filter(
    (request) =>
      request.method === 'GET' &&
      request.endpoint === NON_WORKING_DATE_ENDPOINT,
  );
}

export const GeneralInfoAddNonWorkingDay: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("New Year's Day", {}, LAZY_PAGE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Non-Working Day' }),
    );
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Create Non-Working Day' }),
    ).toBeVisible();
    const date = withinDialog.getByLabelText(/date/i);
    await userEvent.type(date, '2025-02-17');
    await userEvent.type(
      withinDialog.getByRole('textbox', { name: /description/i }),
      "Presidents' Day",
    );
    await userEvent.click(
      withinDialog.getByRole('button', { name: 'Save Non-Working Day' }),
    );
    await expect(
      await canvas.findByText('Non-working day added'),
    ).toBeVisible();
    await expect(await canvas.findByText("Presidents' Day")).toBeVisible();
    const post = api.requests.find((request) => request.method === 'POST');
    await expect(post?.endpoint).toBe(NON_WORKING_DATE_ENDPOINT);
    await expect(post?.body).toEqual({
      nonWorkingDate: '2025-02-17',
      name: "Presidents' Day",
    });
    await expect(nonWorkingDateListGets()).toHaveLength(1);
  },
};

export const GeneralInfoEditNonWorkingDay: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("New Year's Day", {}, LAZY_PAGE);
    await userEvent.click(
      canvas.getByRole('button', { name: "Edit New Year's Day" }),
    );
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Edit Non-Working Day' }),
    ).toBeVisible();
    await expect(withinDialog.getByLabelText(/date/i)).toHaveValue('2025-01-01');
    const description = withinDialog.getByRole('textbox', {
      name: /description/i,
    });
    await expect(description).toHaveValue("New Year's Day");
    await userEvent.clear(description);
    await userEvent.type(description, "New Year's Day Observed");
    await userEvent.click(
      withinDialog.getByRole('button', { name: 'Save Non-Working Day' }),
    );
    await expect(
      await canvas.findByText('Non-working day updated'),
    ).toBeVisible();
    await expect(
      await canvas.findByText("New Year's Day Observed"),
    ).toBeVisible();
    const put = api.requests.find((request) => request.method === 'PUT');
    await expect(put?.endpoint).toBe(`${NON_WORKING_DATE_ENDPOINT}/41`);
    await expect(put?.body).toEqual({
      nonWorkingDate: '2025-01-01',
      name: "New Year's Day Observed",
    });
    await expect(nonWorkingDateListGets()).toHaveLength(1);
  },
};

export const GeneralInfoDeleteNonWorkingDay: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("New Year's Day", {}, LAZY_PAGE);
    await userEvent.click(
      canvas.getByRole('button', { name: "Delete New Year's Day" }),
    );
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Delete Non-Working Day' }),
    ).toBeVisible();
    await userEvent.click(withinDialog.getByRole('button', { name: 'Delete' }));
    await expect(
      await canvas.findByText('Non-working day deleted'),
    ).toBeVisible();
    await expect(canvas.queryByText("New Year's Day")).not.toBeInTheDocument();
    await expect(canvas.getByText('Memorial Day')).toBeVisible();
    const del = api.requests.find((request) => request.method === 'DELETE');
    await expect(del?.endpoint).toBe(`${NON_WORKING_DATE_ENDPOINT}/41`);
    await expect(nonWorkingDateListGets()).toHaveLength(1);
  },
};

export const GeneralInfoEditPhysicalAddress: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Austin, TX 78701', {}, LAZY_PAGE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit Physical Address' }),
    );
    const dialog = await findDialog();
    await waitFor(() => expect(dialog).toBeVisible());
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Edit Physical Address' }),
    ).toBeVisible();
    await expect(
      withinDialog.queryByRole('checkbox', {
        name: 'Same as physical address',
      }),
    ).not.toBeInTheDocument();
    await waitForEnabledCombobox(withinDialog, /^city$/i);
    await chooseSelectOption(withinDialog, /^city$/i, 'Houston');
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await expect(canvas.getByText('Houston, TX 78701')).toBeVisible();
    await expect(
      api.requests.some((request) => request.method === 'PATCH'),
    ).toBe(false);
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Company details updated'),
    ).toBeVisible();
    const patch = api.requests.find((request) => request.method === 'PATCH');
    await expect(patch?.endpoint).toBe(COMPANY_ENDPOINT);
    await expect(patch?.body).toEqual({
      physicalAddress: {
        addressLine1: '100 Main St',
        addressLine2: null,
        city: 'Houston',
        state: 'TX',
        postalCode: '78701',
        country: 'US',
      },
    });
  },
};

export const GeneralInfoBillingSameAsPhysical: Story = {
  args: { initialPath: '/settings/company/general-info' },
  beforeEach: () => api.install(savesCompany),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('No address on file', {}, LAZY_PAGE);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Edit Billing Address' }),
    );
    const dialog = await findDialog();
    await waitFor(() => expect(dialog).toBeVisible());
    const withinDialog = within(dialog);
    await expect(
      withinDialog.getByRole('heading', { name: 'Edit Billing Address' }),
    ).toBeVisible();
    const line1 = withinDialog.getByRole('textbox', {
      name: 'Address Line 1',
    });
    await expect(line1).toHaveValue('');
    await expect(line1).not.toHaveAttribute('readonly');
    await userEvent.click(
      withinDialog.getByRole('checkbox', {
        name: 'Same as physical address',
      }),
    );
    await expect(line1).toHaveValue('100 Main St');
    await expect(line1).toHaveAttribute('readonly');
    await expect(
      withinDialog.getByRole('combobox', { name: 'City' }),
    ).toHaveTextContent('Austin');
    await userEvent.click(withinDialog.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await expect(
      canvas.queryByText('No address on file'),
    ).not.toBeInTheDocument();
    await expect(canvas.getAllByText('100 Main St').length).toBeGreaterThan(1);
    await expect(
      api.requests.some((request) => request.method === 'PATCH'),
    ).toBe(false);
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await canvas.findByText('Company details updated'),
    ).toBeVisible();
    const patch = api.requests.find((request) => request.method === 'PATCH');
    await expect(patch?.body).toEqual({
      billingAddress: {
        addressLine1: '100 Main St',
        addressLine2: null,
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'US',
      },
    });
  },
};

type StoryBusinessType = {
  id: number;
  code: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
};

function businessTypeHandlers(): ApiHandlers {
  const items: StoryBusinessType[] = [
    {
      id: 71,
      code: 'HVAC',
      name: 'HVAC',
      description: 'Heating and cooling',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 72,
      code: 'PLMB',
      name: 'Plumbing',
      description: 'Pipes and fixtures',
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 73,
      code: 'PEST',
      name: 'Pest Control',
      description: 'Pest inspection and treatment',
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 74,
      code: 'ELEC',
      name: 'Electrical',
      description: 'Electrical service',
      displayOrder: 4,
      isActive: true,
    },
    {
      id: 75,
      code: 'CLEAN',
      name: 'Home Cleaning',
      description: 'Residential cleaning',
      displayOrder: 5,
      isActive: true,
    },
    {
      id: 76,
      code: 'JUNK',
      name: 'Junk Removal',
      description: 'Haul-away and cleanup',
      displayOrder: 6,
      isActive: true,
    },
    {
      id: 77,
      code: 'GARDEN',
      name: 'Garden Management',
      description: 'Lawn and garden',
      displayOrder: 7,
      isActive: false,
    },
  ];
  const handlers: ApiHandlers = {
    'GET /businesstype': () =>
      jsonResponse(
        setupEnvelope({
          items,
          page: 1,
          pageSize: 1000,
          totalCount: items.length,
        }),
      ),
  };
  for (const item of items) {
    handlers[`PATCH /businesstype/${item.id}`] = async (request) => {
      const body = (await request.json()) as { isActive?: boolean };
      if (typeof body.isActive === 'boolean') item.isActive = body.isActive;
      return jsonResponse(setupEnvelope(item));
    };
  }
  return handlers;
}

export const BusinessTypeListing: Story = {
  args: { initialPath: '/settings/company/business-type' },
  beforeEach: () => api.install(businessTypeHandlers()),
  play: async ({ canvasElement }) => {
    alert.remove();
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('heading', { name: 'Business Type' }, LAZY_PAGE),
    ).toBeVisible();
    await expect(
      await canvas.findByText('HVAC', {}, LAZY_PAGE),
    ).toBeVisible();
    await expect(canvas.getByRole('switch', { name: 'HVAC' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    const garden = canvas.getByRole('switch', { name: 'Garden Management' });
    await expect(garden).toBeEnabled();
    await userEvent.click(garden);
    await expect(
      await within(document.body).findByText(
        'Business Type enabled successfully.',
        {},
        LAZY_PAGE,
      ),
    ).toBeVisible();
    const patch = api.requests.find((request) => request.method === 'PATCH');
    await expect(patch?.endpoint).toBe('/businesstype/77');
    await expect(patch?.body).toEqual({ isActive: true });
    await waitFor(() => {
      expect(
        canvas.getByRole('switch', { name: 'Garden Management' }),
      ).toHaveAttribute('aria-disabled', 'true');
    }, LAZY_PAGE);
  },
};

export const BusinessTypeFromGrid: Story = {
  beforeEach: () => api.install(businessTypeHandlers()),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole('button', { name: /^Business Type/ }, LAZY_PAGE),
    );
    await expect(
      await canvas.findByRole('heading', { name: 'Business Type' }, LAZY_PAGE),
    ).toBeVisible();
    await expect(
      await canvas.findByText('Plumbing', {}, LAZY_PAGE),
    ).toBeVisible();
  },
};
