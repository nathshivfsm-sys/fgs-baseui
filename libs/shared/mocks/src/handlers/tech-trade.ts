import { http } from 'msw';
import {
  techTradeCreateDtoSchema,
  techTradePatchDtoSchema,
  techTradeUpdateDtoSchema,
  type TechTradeCreateDto,
  type TechTradeDetailDto,
  type TechTradeLookupDto,
  type TechTradeSummaryDto,
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
  setupNoContent,
  setupOk,
} from './util';

function seedTechTrades(): TechTradeDetailDto[] {
  return [
    {
      id: 51,
      tradeCode: 'HVAC',
      name: 'HVAC- Repair',
      description: 'Heating, Ventilation and Air Conditioning repairing',
      sortOrder: 1,
      isActive: true,
      skillIds: [61, 62],
    },
    {
      id: 52,
      tradeCode: 'PLUMB',
      name: 'Plumbing',
      description: 'Residential and commercial plumbing',
      sortOrder: 2,
      isActive: true,
      skillIds: [61, 62],
    },
    {
      id: 53,
      tradeCode: 'ELEC',
      name: 'Electrical',
      description: 'Electrical service and repair',
      sortOrder: 3,
      isActive: true,
      skillIds: [61, 62],
    },
    {
      id: 54,
      tradeCode: 'PLUMB',
      name: 'Plumbing Repair',
      description: 'Plumbing repair',
      sortOrder: 4,
      isActive: true,
      skillIds: [61, 62],
    },
    {
      id: 55,
      tradeCode: 'ELEC',
      name: 'Electrical',
      description: 'Residential electrical',
      sortOrder: 5,
      isActive: true,
      skillIds: [61],
    },
    {
      id: 56,
      tradeCode: 'APPL',
      name: 'Appliance',
      description: 'Appliance repair',
      sortOrder: 6,
      isActive: false,
      skillIds: [],
    },
    {
      id: 57,
      tradeCode: 'ARCH',
      name: 'Archived HVAC',
      description: 'Legacy HVAC trade',
      sortOrder: 99,
      isActive: false,
      skillIds: [],
    },
  ];
}

const techTrades = seedTechTrades();

function toSummary(record: TechTradeDetailDto): TechTradeSummaryDto {
  return {
    id: record.id,
    tradeCode: record.tradeCode,
    name: record.name,
    sortOrder: record.sortOrder,
    isActive: record.isActive,
  };
}

function toLookup(record: TechTradeDetailDto): TechTradeLookupDto {
  return {
    id: record.id,
    tradeCode: record.tradeCode,
    name: record.name,
    sortOrder: record.sortOrder,
  };
}

function findTechTrade(id: number | undefined): TechTradeDetailDto | undefined {
  return id === undefined
    ? undefined
    : techTrades.find((record) => record.id === id);
}

function filterTechTrades(url: URL): TechTradeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const tradeCode = url.searchParams.get('tradeCode');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return techTrades.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      tradeCode &&
      (record.tradeCode ?? '').toLowerCase() !== tradeCode.toLowerCase()
    ) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [
      record.tradeCode,
      record.name,
      record.description,
    ]);
  });
}

function createFromBody(body: TechTradeCreateDto): TechTradeDetailDto {
  return {
    id: nextId(techTrades),
    tradeCode: body.tradeCode ?? null,
    name: body.name ?? null,
    description: body.description ?? null,
    sortOrder: body.sortOrder ?? null,
    isActive: true,
    skillIds: body.skillIds ?? [],
  };
}

/**
 * In-memory `/techtrade` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const techTradeHandlers = [
  http.get('/api/v1/techtrade/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = techTrades
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/techtrade/:id', ({ params }) => {
    const record = findTechTrade(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tech trade not found.');
    return setupOk(record);
  }),

  http.get('/api/v1/techtrade', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterTechTrades(url).map(toSummary), url));
  }),

  http.post('/api/v1/techtrade', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = techTradeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    techTrades.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/techtrade/:id', async ({ params, request }) => {
    const record = findTechTrade(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tech trade not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = techTradeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/techtrade/:id', async ({ params, request }) => {
    const record = findTechTrade(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Tech trade not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = techTradePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.delete('/api/v1/techtrade/:id', ({ params }) => {
    const id = parseRouteId(params['id']);
    const index = techTrades.findIndex((record) => record.id === id);
    if (index < 0) return setupError(404, 'Tech trade not found.');
    techTrades.splice(index, 1);
    return setupNoContent();
  }),
];
