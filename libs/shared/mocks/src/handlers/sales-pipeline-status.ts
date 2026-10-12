import { http } from 'msw';
import {
  salesPipelineStatusCreateDtoSchema,
  salesPipelineStatusPatchDtoSchema,
  salesPipelineStatusUpdateDtoSchema,
  type SalesPipelineStatusCreateDto,
  type SalesPipelineStatusDetailDto,
  type SalesPipelineStatusLookupDto,
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

function seedSalesPipelineStatuses(): SalesPipelineStatusDetailDto[] {
  return [
    {
      id: 81,
      statusCode: 'NEW',
      statusName: 'New Lead',
      description: 'Initial pipeline stage',
      displayOrder: 1,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: false,
      isTerminal: false,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 82,
      statusCode: 'CONTACTED',
      statusName: 'Contacted',
      description: 'First contact made',
      displayOrder: 2,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: true,
      isTerminal: false,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 83,
      statusCode: 'QUALIFIED',
      statusName: 'Qualified',
      description: 'Meets qualification criteria',
      displayOrder: 3,
      isSystem: false,
      appliesToLead: true,
      appliesToOpportunity: true,
      isTerminal: false,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 84,
      statusCode: 'WON',
      statusName: 'Won',
      description: 'Closed won',
      displayOrder: 4,
      isSystem: true,
      appliesToLead: false,
      appliesToOpportunity: true,
      isTerminal: true,
      allowManualSelection: false,
      isActive: true,
    },
    {
      id: 85,
      statusCode: 'LOST',
      statusName: 'Lost',
      description: 'Closed lost (inactive)',
      displayOrder: 5,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: true,
      isTerminal: true,
      allowManualSelection: false,
      isActive: false,
    },
  ];
}

const salesPipelineStatuses = seedSalesPipelineStatuses();

function toLookup(
  record: SalesPipelineStatusDetailDto,
): SalesPipelineStatusLookupDto {
  return {
    id: record.id,
    statusCode: record.statusCode,
    statusName: record.statusName,
    displayOrder: record.displayOrder,
  };
}

function findSalesPipelineStatus(
  id: number | undefined,
): SalesPipelineStatusDetailDto | undefined {
  return id === undefined
    ? undefined
    : salesPipelineStatuses.find((record) => record.id === id);
}

function filterSalesPipelineStatuses(url: URL): SalesPipelineStatusDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const statusCode = url.searchParams.get('statusCode');
  const statusName = url.searchParams.get('statusName');
  const search = url.searchParams.get('search');
  return salesPipelineStatuses.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      statusCode &&
      (record.statusCode ?? '').toLowerCase() !== statusCode.toLowerCase()
    ) {
      return false;
    }
    if (
      statusName &&
      !(record.statusName ?? '')
        .toLowerCase()
        .includes(statusName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.statusCode,
      record.statusName,
      record.description,
    ]);
  });
}

function createFromBody(
  body: SalesPipelineStatusCreateDto,
): SalesPipelineStatusDetailDto {
  return {
    id: nextId(salesPipelineStatuses),
    statusCode: body.statusCode ?? null,
    statusName: body.statusName ?? null,
    description: body.description ?? null,
    displayOrder: body.displayOrder ?? 0,
    isSystem: body.isSystem,
    appliesToLead: body.appliesToLead,
    appliesToOpportunity: body.appliesToOpportunity,
    isTerminal: body.isTerminal,
    allowManualSelection: body.allowManualSelection,
    isActive: true,
  };
}

/**
 * In-memory `/salespipelinestatus` catalog. Mutations persist for the session
 * so a follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const salesPipelineStatusHandlers = [
  http.get('/api/v1/salespipelinestatus/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = salesPipelineStatuses
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/salespipelinestatus/:id', ({ params }) => {
    const record = findSalesPipelineStatus(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales pipeline status not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/salespipelinestatus/:id', async ({ params, request }) => {
    const record = findSalesPipelineStatus(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales pipeline status not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesPipelineStatusUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/salespipelinestatus/:id', async ({ params, request }) => {
    const record = findSalesPipelineStatus(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales pipeline status not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesPipelineStatusPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/salespipelinestatus', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterSalesPipelineStatuses(url), url));
  }),

  http.post('/api/v1/salespipelinestatus', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesPipelineStatusCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    salesPipelineStatuses.push(created);
    return setupOk(created, 201);
  }),
];
