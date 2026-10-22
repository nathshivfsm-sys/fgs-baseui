import { http } from 'msw';
import {
  salesActivityOutcomeCreateDtoSchema,
  salesActivityOutcomePatchDtoSchema,
  salesActivityOutcomeUpdateDtoSchema,
  type SalesActivityOutcomeCreateDto,
  type SalesActivityOutcomeDetailDto,
  type SalesActivityOutcomeLookupDto,
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

function seedSalesActivityOutcomes(): SalesActivityOutcomeDetailDto[] {
  return [
    {
      id: 91,
      outcomeCode: 'WON',
      outcomeName: 'Won',
      description: 'Deal won',
      displayOrder: 1,
      isSystem: true,
      appliesToLead: false,
      appliesToOpportunity: true,
      nextSalesPipelineStatusId: null,
      isTerminal: true,
      requireComment: false,
      allowManualSelection: false,
      isActive: true,
    },
    {
      id: 92,
      outcomeCode: 'CUSTOMER_REPLIED',
      outcomeName: 'Customer Replied',
      description: 'Customer responded to previous communication.',
      displayOrder: 2,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: true,
      nextSalesPipelineStatusId: 82,
      isTerminal: false,
      requireComment: false,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 93,
      outcomeCode: 'NOANSWER',
      outcomeName: 'No Answer',
      description: 'No one picked up',
      displayOrder: 3,
      isSystem: false,
      appliesToLead: true,
      appliesToOpportunity: false,
      nextSalesPipelineStatusId: null,
      isTerminal: false,
      requireComment: false,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 94,
      outcomeCode: 'QUALIFIED',
      outcomeName: 'Qualified',
      description: 'Meets qualification criteria',
      displayOrder: 4,
      isSystem: false,
      appliesToLead: true,
      appliesToOpportunity: true,
      nextSalesPipelineStatusId: 83,
      isTerminal: false,
      requireComment: true,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 95,
      outcomeCode: 'LOST',
      outcomeName: 'Lost',
      description: 'Closed lost (inactive)',
      displayOrder: 5,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: true,
      nextSalesPipelineStatusId: null,
      isTerminal: true,
      requireComment: true,
      allowManualSelection: false,
      isActive: false,
    },
  ];
}

const salesActivityOutcomes = seedSalesActivityOutcomes();

function toLookup(
  record: SalesActivityOutcomeDetailDto,
): SalesActivityOutcomeLookupDto {
  return {
    id: record.id,
    outcomeCode: record.outcomeCode,
    outcomeName: record.outcomeName,
    displayOrder: record.displayOrder,
  };
}

function findSalesActivityOutcome(
  id: number | undefined,
): SalesActivityOutcomeDetailDto | undefined {
  return id === undefined
    ? undefined
    : salesActivityOutcomes.find((record) => record.id === id);
}

function filterSalesActivityOutcomes(
  url: URL,
): SalesActivityOutcomeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const outcomeCode = url.searchParams.get('outcomeCode');
  const outcomeName = url.searchParams.get('outcomeName');
  const search = url.searchParams.get('search');
  return salesActivityOutcomes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      outcomeCode &&
      (record.outcomeCode ?? '').toLowerCase() !== outcomeCode.toLowerCase()
    ) {
      return false;
    }
    if (
      outcomeName &&
      !(record.outcomeName ?? '')
        .toLowerCase()
        .includes(outcomeName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.outcomeCode,
      record.outcomeName,
      record.description,
    ]);
  });
}

function createFromBody(
  body: SalesActivityOutcomeCreateDto,
): SalesActivityOutcomeDetailDto {
  return {
    id: nextId(salesActivityOutcomes),
    outcomeCode: body.outcomeCode ?? null,
    outcomeName: body.outcomeName ?? null,
    description: body.description ?? null,
    displayOrder: body.displayOrder ?? 0,
    isSystem: body.isSystem,
    appliesToLead: body.appliesToLead,
    appliesToOpportunity: body.appliesToOpportunity,
    nextSalesPipelineStatusId: body.nextSalesPipelineStatusId ?? null,
    isTerminal: body.isTerminal,
    requireComment: body.requireComment,
    allowManualSelection: body.allowManualSelection,
    isActive: true,
  };
}

/**
 * In-memory `/salesactivityoutcome` catalog. Mutations persist for the session
 * so a follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const salesActivityOutcomeHandlers = [
  http.get('/api/v1/salesactivityoutcome/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = salesActivityOutcomes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/salesactivityoutcome/:id', ({ params }) => {
    const record = findSalesActivityOutcome(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales activity outcome not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/salesactivityoutcome/:id', async ({ params, request }) => {
    const record = findSalesActivityOutcome(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales activity outcome not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesActivityOutcomeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch(
    '/api/v1/salesactivityoutcome/:id',
    async ({ params, request }) => {
      const record = findSalesActivityOutcome(parseRouteId(params['id']));
      if (!record) return setupError(404, 'Sales activity outcome not found.');
      const body = await readJsonObject(request);
      if (!body.ok) return body.response;
      const parsed = salesActivityOutcomePatchDtoSchema.safeParse(body.value);
      if (!parsed.success)
        return setupError(400, firstIssueMessage(parsed.error));
      assignDefined(record, parsed.data);
      return setupOk(record);
    },
  ),

  http.get('/api/v1/salesactivityoutcome', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterSalesActivityOutcomes(url), url));
  }),

  http.post('/api/v1/salesactivityoutcome', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesActivityOutcomeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    salesActivityOutcomes.push(created);
    return setupOk(created, 201);
  }),
];
