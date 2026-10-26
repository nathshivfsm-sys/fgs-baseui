import { http } from 'msw';
import {
  customerCreateDtoSchema,
  customerPatchDtoSchema,
  customerUpdateDtoSchema,
  type CustomerCreateDto,
  type CustomerDetailDto,
  type CustomerFinancialSummaryDto,
  type CustomerLookupDto,
  type CustomerSummaryDto,
} from '@cms/customer-contract';
import {
  assignDefined,
  firstIssueMessage,
  matchesSearch,
  nextId,
  pagedResult,
  parseRouteId,
  readJsonObject,
  readOptionalBoolean,
  setupError,
  setupOk,
} from './util';

type CustomerRecord = CustomerDetailDto & {
  isPreferredCustomer: boolean;
};

function seedCustomers(): CustomerRecord[] {
  return [
    {
      id: 501,
      customerNumber: 'C-1001',
      name: 'Rivera Home Services',
      displayName: 'Rivera Home Services',
      addressLine1: '1200 Oak St',
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      city: 'Austin',
      state: 'TX',
      county: 'Travis',
      country: 'US',
      postalCode: '78701',
      formattedAddress: '1200 Oak St, Austin, TX 78701',
      latitude: 30.2672,
      longitude: -97.7431,
      placeId: null,
      defaultPaymentTermId: null,
      defaultMaterialPricingMatrixId: null,
      defaultLaborPricingMatrixId: null,
      defaultOtherPricingMatrixId: null,
      defaultPORequired: false,
      taxExempt: false,
      taxExemptNumber: null,
      customerAccountNumber: 'ACCT-501',
      externalEntityId: null,
      externalVersion: null,
      isActive: true,
      website: 'https://rivera.example.com',
      primaryContactName: 'Maria Rivera',
      primaryContactEmail: 'maria@rivera.example.com',
      primaryContactPhone: '+1-555-1001',
      createdOn: '2026-01-15T10:00:00Z',
      tagIds: [1, 2],
      isPreferredCustomer: true,
    },
    {
      id: 502,
      customerNumber: 'C-1002',
      name: 'Downtown Office Tower',
      displayName: 'Downtown Office Tower',
      addressLine1: '500 Congress Ave',
      addressLine2: 'Suite 900',
      addressLine3: null,
      addressLine4: null,
      city: 'Austin',
      state: 'TX',
      county: 'Travis',
      country: 'US',
      postalCode: '78701',
      formattedAddress: '500 Congress Ave Suite 900, Austin, TX 78701',
      latitude: null,
      longitude: null,
      placeId: null,
      defaultPaymentTermId: 2,
      defaultMaterialPricingMatrixId: null,
      defaultLaborPricingMatrixId: null,
      defaultOtherPricingMatrixId: null,
      defaultPORequired: true,
      taxExempt: false,
      taxExemptNumber: null,
      customerAccountNumber: null,
      externalEntityId: null,
      externalVersion: null,
      isActive: true,
      website: null,
      primaryContactName: 'Jordan Lee',
      primaryContactEmail: 'jordan@tower.example.com',
      primaryContactPhone: '+1-555-1002',
      createdOn: '2026-02-01T14:30:00Z',
      tagIds: [],
      isPreferredCustomer: false,
    },
    {
      id: 503,
      customerNumber: 'C-1003',
      name: 'Former Tenant LLC',
      displayName: 'Former Tenant LLC',
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      city: 'Dallas',
      state: 'TX',
      county: null,
      country: 'US',
      postalCode: '75201',
      formattedAddress: null,
      latitude: null,
      longitude: null,
      placeId: null,
      defaultPaymentTermId: null,
      defaultMaterialPricingMatrixId: null,
      defaultLaborPricingMatrixId: null,
      defaultOtherPricingMatrixId: null,
      defaultPORequired: false,
      taxExempt: false,
      taxExemptNumber: null,
      customerAccountNumber: null,
      externalEntityId: null,
      externalVersion: null,
      isActive: false,
      website: null,
      primaryContactName: null,
      primaryContactEmail: null,
      primaryContactPhone: null,
      createdOn: '2025-11-10T09:00:00Z',
      tagIds: null,
      isPreferredCustomer: false,
    },
  ];
}

const customers = seedCustomers();

function financialSummaryForCustomer(
  id: number,
): CustomerFinancialSummaryDto | null {
  const seeded: Record<number, CustomerFinancialSummaryDto> = {
    501: {
      arBalance: 23_000,
      totalSales: 48_320,
      activeCardsOnFile: 4,
      scheduledPaymentsCount: 5,
    },
    502: {
      arBalance: 4_250.5,
      totalSales: 112_400,
      activeCardsOnFile: 2,
      scheduledPaymentsCount: 1,
    },
    503: {
      arBalance: 0,
      totalSales: 8_900,
      activeCardsOnFile: 0,
      scheduledPaymentsCount: 0,
    },
  };
  return seeded[id] ?? null;
}

function toSummary(record: CustomerRecord): CustomerSummaryDto {
  return {
    id: record.id,
    customerNumber: record.customerNumber,
    name: record.name,
    displayName: record.displayName,
    city: record.city,
    state: record.state,
    postalCode: record.postalCode,
    country: record.country,
    customerAccountNumber: record.customerAccountNumber,
    isActive: record.isActive,
    formattedAddress: record.formattedAddress,
    primaryContactName: record.primaryContactName,
    email: record.primaryContactEmail,
    phone: record.primaryContactPhone,
    tagIds: record.tagIds,
    createdOn: record.createdOn,
    isPreferredCustomer: record.isPreferredCustomer,
  };
}

function toLookup(record: CustomerRecord): CustomerLookupDto {
  return {
    id: record.id,
    customerNumber: record.customerNumber,
    displayName: record.displayName,
  };
}

function findCustomer(id: number | undefined): CustomerRecord | undefined {
  return id === undefined
    ? undefined
    : customers.find((record) => record.id === id);
}

function listSummary() {
  const activeCustomers = customers.filter((record) => record.isActive).length;
  return {
    totalCustomers: customers.length,
    activeCustomers,
    inactiveCustomers: customers.length - activeCustomers,
    newThisMonth: 1,
    previousMonthNewCustomers: 0,
    newCustomerPercentChange: null,
  };
}

function filterCustomers(url: URL): CustomerRecord[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const isPreferred = readOptionalBoolean(url, 'isPreferred');
  const customerNumber = url.searchParams.get('customerNumber');
  const name = url.searchParams.get('name');
  const displayName = url.searchParams.get('displayName');
  const search = url.searchParams.get('search');
  return customers.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      isPreferred !== undefined &&
      record.isPreferredCustomer !== isPreferred
    ) {
      return false;
    }
    if (
      customerNumber &&
      (record.customerNumber ?? '').toLowerCase() !==
        customerNumber.toLowerCase()
    ) {
      return false;
    }
    if (
      name &&
      !(record.name ?? '').toLowerCase().includes(name.toLowerCase())
    ) {
      return false;
    }
    if (
      displayName &&
      !(record.displayName ?? '')
        .toLowerCase()
        .includes(displayName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.customerNumber,
      record.name,
      record.displayName,
      record.city,
      record.primaryContactEmail,
      record.primaryContactPhone,
    ]);
  });
}

function nextCustomerNumber(): string {
  const numbers = customers
    .map((record) => record.customerNumber)
    .filter((value): value is string => value != null && value.startsWith('C-'))
    .map((value) => Number.parseInt(value.slice(2), 10))
    .filter((value) => !Number.isNaN(value));
  const max = numbers.length > 0 ? Math.max(...numbers) : 1000;
  return `C-${max + 1}`;
}

function createFromBody(body: CustomerCreateDto): CustomerRecord {
  return {
    id: nextId(customers),
    customerNumber: nextCustomerNumber(),
    name: body.name ?? null,
    displayName: body.displayName ?? null,
    addressLine1: body.addressLine1 ?? null,
    addressLine2: body.addressLine2 ?? null,
    addressLine3: body.addressLine3 ?? null,
    addressLine4: body.addressLine4 ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    county: body.county ?? null,
    country: body.country ?? null,
    postalCode: body.postalCode ?? null,
    formattedAddress: body.formattedAddress ?? null,
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
    placeId: body.placeId ?? null,
    defaultPaymentTermId: body.defaultPaymentTermId ?? null,
    defaultMaterialPricingMatrixId: body.defaultMaterialPricingMatrixId ?? null,
    defaultLaborPricingMatrixId: body.defaultLaborPricingMatrixId ?? null,
    defaultOtherPricingMatrixId: body.defaultOtherPricingMatrixId ?? null,
    defaultPORequired: body.defaultPORequired,
    taxExempt: body.taxExempt,
    taxExemptNumber: body.taxExemptNumber ?? null,
    customerAccountNumber: body.customerAccountNumber ?? null,
    externalEntityId: body.externalEntityId ?? null,
    externalVersion: body.externalVersion ?? null,
    isActive: true,
    website: body.website ?? null,
    primaryContactName: body.primaryContactName ?? null,
    primaryContactEmail: body.primaryContactEmail ?? null,
    primaryContactPhone: body.primaryContactPhone ?? null,
    createdOn: new Date().toISOString(),
    tagIds: body.tagIds ?? null,
    isPreferredCustomer: false,
  };
}

/**
 * In-memory `/customer` catalog. Mutations persist for the session so a follow-up
 * GET after invalidation shows the saved values. Request/response shapes come
 * from `@cms/customer-contract`.
 */
export const customerHandlers = [
  http.get('/api/v1/customer/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = customers
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/customer/:id/financialsummary', ({ params }) => {
    const id = parseRouteId(params['id']);
    const record = findCustomer(id);
    if (!record) return setupError(404, 'Customer not found.');
    const summary = financialSummaryForCustomer(record.id);
    if (!summary) {
      return setupError(404, 'Customer financial summary not found.');
    }
    return setupOk(summary);
  }),

  http.get('/api/v1/customer/:id', ({ params }) => {
    const record = findCustomer(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Customer not found.');
    const { isPreferredCustomer: _ignored, ...detail } = record;
    return setupOk(detail);
  }),

  http.get('/api/v1/customer', ({ request }) => {
    const url = new URL(request.url);
    const filtered = filterCustomers(url);
    const includeSummary = readOptionalBoolean(url, 'includeSummary') ?? true;
    const page = pagedResult(filtered.map(toSummary), url);
    return setupOk({
      ...page,
      ...(includeSummary ? { summary: listSummary() } : {}),
    });
  }),

  http.post('/api/v1/customer', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = customerCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    let payload = parsed.data;
    if (payload.creationOption === 'billToAndServiceLocation') {
      if (!payload.serviceLocation) {
        return setupError(
          400,
          'Service location is required for Bill To and Service Location.',
        );
      }
    } else {
      const { serviceLocation: _ignored, ...billToOnlyBody } = payload;
      payload = { ...billToOnlyBody, creationOption: 'billToOnly' };
    }
    const created = createFromBody(payload);
    customers.push(created);
    const serviceLocationId =
      payload.creationOption === 'billToAndServiceLocation' &&
      payload.serviceLocation
        ? nextId(customers) + 1000
        : null;
    const { isPreferredCustomer: _ignored, ...detail } = created;
    return setupOk({ customer: detail, serviceLocationId }, 201);
  }),

  http.put('/api/v1/customer/:id', async ({ params, request }) => {
    const record = findCustomer(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Customer not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = customerUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    const { isPreferredCustomer: _ignored, ...detail } = record;
    return setupOk(detail);
  }),

  http.patch('/api/v1/customer/:id', async ({ params, request }) => {
    const record = findCustomer(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Customer not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = customerPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    const { isPreferredCustomer: _ignored, ...detail } = record;
    return setupOk(detail);
  }),
];
