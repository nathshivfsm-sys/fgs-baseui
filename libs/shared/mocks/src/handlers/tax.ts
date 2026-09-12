import { http } from 'msw';
import {
  taxCreateDtoSchema,
  taxPatchDtoSchema,
  taxUpdateDtoSchema,
  type TaxCreateDto,
  type TaxDetailDto,
  type TaxLookupDto,
  type TaxSummaryDto,
} from '@cms/settings-contract';
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

type TaxRecord = TaxDetailDto & {
  isExternalSystemRecord: boolean;
  externalSystemId: string | null;
  syncToken: string | null;
};

function seedTaxes(): TaxRecord[] {
  return [
    {
      id: 11,
      taxCode: 'TX-STD',
      name: 'Standard Tax',
      isExternalSystemRecord: false,
      externalSystemId: null,
      syncToken: null,
      showTaxDetail: true,
      description: 'State plus city sales tax',
      taxRate: 8.25,
      isActive: true,
      taxDetails: [
        {
          id: 101,
          fgsSetupTaxAuthorityId: 21,
          taxAuthorityCode: 'TX-STATE',
          taxAuthorityName: 'Texas State',
          taxPercent: 6.25,
          effectiveFromDate: '2026-01-01',
          effectiveToDate: null,
          isActive: true,
        },
        {
          id: 102,
          fgsSetupTaxAuthorityId: 22,
          taxAuthorityCode: 'AUS-CITY',
          taxAuthorityName: 'Austin City',
          taxPercent: 2,
          effectiveFromDate: '2026-01-01',
          effectiveToDate: null,
          isActive: true,
        },
      ],
    },
    {
      id: 12,
      taxCode: 'TX-LABOR',
      name: 'Labor Tax',
      isExternalSystemRecord: false,
      externalSystemId: null,
      syncToken: null,
      showTaxDetail: true,
      description: 'Tax applied to labor charges',
      taxRate: 8.25,
      isActive: true,
      taxDetails: [
        {
          id: 103,
          fgsSetupTaxAuthorityId: 21,
          taxAuthorityCode: 'TX-STATE',
          taxAuthorityName: 'Texas State',
          taxPercent: 6.25,
          effectiveFromDate: '2026-01-01',
          effectiveToDate: null,
          isActive: true,
        },
        {
          id: 104,
          fgsSetupTaxAuthorityId: 22,
          taxAuthorityCode: 'AUS-CITY',
          taxAuthorityName: 'Austin City',
          taxPercent: 2,
          effectiveFromDate: '2026-01-01',
          effectiveToDate: null,
          isActive: true,
        },
      ],
    },
    {
      id: 13,
      taxCode: 'TX-EXEMPT',
      name: 'Exempt',
      isExternalSystemRecord: false,
      externalSystemId: null,
      syncToken: null,
      showTaxDetail: false,
      description: 'No tax collected',
      taxRate: 0,
      isActive: false,
      taxDetails: [],
    },
  ];
}

const taxes = seedTaxes();

function toSummary(record: TaxRecord): TaxSummaryDto {
  return {
    id: record.id,
    taxCode: record.taxCode,
    name: record.name,
    showTaxDetail: record.showTaxDetail,
    description: record.description,
    taxRate: record.taxRate,
    isActive: record.isActive,
  };
}

function toLookup(record: TaxRecord): TaxLookupDto {
  return {
    id: record.id,
    taxCode: record.taxCode,
    name: record.name,
    taxRate: record.taxRate,
  };
}

function findTax(id: number | undefined): TaxRecord | undefined {
  return id === undefined ? undefined : taxes.find((record) => record.id === id);
}

function filterTaxes(url: URL): TaxRecord[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const taxCode = url.searchParams.get('taxCode');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return taxes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (taxCode && (record.taxCode ?? '').toLowerCase() !== taxCode.toLowerCase()) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [record.taxCode, record.name, record.description]);
  });
}

function createFromBody(body: TaxCreateDto): TaxRecord {
  return {
    id: nextId(taxes),
    taxCode: body.taxCode ?? null,
    name: body.name ?? null,
    isExternalSystemRecord: body.isExternalSystemRecord,
    externalSystemId: body.externalSystemId ?? null,
    syncToken: body.syncToken ?? null,
    showTaxDetail: body.showTaxDetail,
    description: body.description ?? null,
    taxRate: 0,
    isActive: true,
    taxDetails: [],
  };
}

/**
 * In-memory `/tax` catalog. Mutations persist for the session so a follow-up
 * GET after invalidation shows the saved values. Request/response shapes come
 * from `@cms/settings-contract`.
 */
export const taxHandlers = [
  http.get('/api/v1/tax/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = taxes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/tax/:id', ({ params }) => {
    const record = findTax(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tax not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/tax', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterTaxes(url).map(toSummary), url));
  }),

  http.post('/api/v1/tax', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = taxCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    taxes.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/tax/:id', async ({ params, request }) => {
    const record = findTax(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tax not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = taxUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/tax/:id', async ({ params, request }) => {
    const record = findTax(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tax not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = taxPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),
];
