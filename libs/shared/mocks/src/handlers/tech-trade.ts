import { http } from 'msw';
import {
  techTradeCreateDtoSchema,
  techTradePatchDtoSchema,
  techTradeUpdateDtoSchema,
  type TechTradeCreateDto,
  type TechTradeDetailDto,
  type TechTradeLookupDto,
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

function seedTechTrades(): TechTradeDetailDto[] {
  return [
    {
      id: 51,
      tradeCode: 'HVAC',
      name: 'HVAC',
      description: 'Heating, ventilation, and air conditioning',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 52,
      tradeCode: 'PLUMB',
      name: 'Plumbing',
      description: 'Residential plumbing',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 53,
      tradeCode: 'ELEC',
      name: 'Electrical',
      description: 'Residential electrical',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 54,
      tradeCode: 'APPL',
      name: 'Appliance',
      description: 'Appliance repair',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 55,
      tradeCode: 'ARCH',
      name: 'Archived HVAC',
      description: 'Legacy HVAC trade',
      sortOrder: 99,
      isActive: false,
    },
  ];
}

const techTrades = seedTechTrades();

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
    return setupOk(pagedResult(filterTechTrades(url), url));
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
];
