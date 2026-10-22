import { http } from 'msw';
import {
  salesActivityTypeCreateDtoSchema,
  salesActivityTypePatchDtoSchema,
  salesActivityTypeUpdateDtoSchema,
  type SalesActivityTypeCreateDto,
  type SalesActivityTypeDetailDto,
  type SalesActivityTypeLookupDto,
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

function seedSalesActivityTypes(): SalesActivityTypeDetailDto[] {
  return [
    {
      id: 101,
      activityTypeCode: 'CALL',
      activityTypeName: 'Phone Call',
      description: 'Outbound or inbound customer phone call.',
      displayOrder: 1,
      isSystem: true,
      appliesToLead: false,
      appliesToOpportunity: true,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 102,
      activityTypeCode: 'EMAIL',
      activityTypeName: 'Email',
      description: 'Sales email sent to or received from a customer.',
      displayOrder: 2,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: true,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 103,
      activityTypeCode: 'SMS',
      activityTypeName: 'Text Message',
      description: 'SMS conversation with a customer or prospect.',
      displayOrder: 3,
      isSystem: false,
      appliesToLead: true,
      appliesToOpportunity: true,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 104,
      activityTypeCode: 'MEETING',
      activityTypeName: 'Sales Meeting',
      description: 'Scheduled sales consultation or review.',
      displayOrder: 4,
      isSystem: false,
      appliesToLead: false,
      appliesToOpportunity: true,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 105,
      activityTypeCode: 'SITE_VISIT',
      activityTypeName: 'Site Visit',
      description: 'On-site visit to assess customer requirements.',
      displayOrder: 5,
      isSystem: false,
      appliesToLead: false,
      appliesToOpportunity: true,
      allowManualSelection: true,
      isActive: true,
    },
    {
      id: 106,
      activityTypeCode: 'NOTE',
      activityTypeName: 'Note',
      description: 'Internal note (inactive).',
      displayOrder: 6,
      isSystem: true,
      appliesToLead: true,
      appliesToOpportunity: true,
      allowManualSelection: false,
      isActive: false,
    },
  ];
}

const salesActivityTypes = seedSalesActivityTypes();

function toLookup(
  record: SalesActivityTypeDetailDto,
): SalesActivityTypeLookupDto {
  return {
    id: record.id,
    activityTypeCode: record.activityTypeCode,
    activityTypeName: record.activityTypeName,
    displayOrder: record.displayOrder,
  };
}

function findSalesActivityType(
  id: number | undefined,
): SalesActivityTypeDetailDto | undefined {
  return id === undefined
    ? undefined
    : salesActivityTypes.find((record) => record.id === id);
}

function filterSalesActivityTypes(url: URL): SalesActivityTypeDetailDto[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const activityTypeCode = url.searchParams.get('activityTypeCode');
  const activityTypeName = url.searchParams.get('activityTypeName');
  const search = url.searchParams.get('search');
  return salesActivityTypes.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      activityTypeCode &&
      (record.activityTypeCode ?? '').toLowerCase() !==
        activityTypeCode.toLowerCase()
    ) {
      return false;
    }
    if (
      activityTypeName &&
      !(record.activityTypeName ?? '')
        .toLowerCase()
        .includes(activityTypeName.toLowerCase())
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.activityTypeCode,
      record.activityTypeName,
      record.description,
    ]);
  });
}

function createFromBody(
  body: SalesActivityTypeCreateDto,
): SalesActivityTypeDetailDto {
  return {
    id: nextId(salesActivityTypes),
    activityTypeCode: body.activityTypeCode ?? null,
    activityTypeName: body.activityTypeName ?? null,
    description: body.description ?? null,
    displayOrder: body.displayOrder ?? 0,
    isSystem: body.isSystem,
    appliesToLead: body.appliesToLead,
    appliesToOpportunity: body.appliesToOpportunity,
    allowManualSelection: body.allowManualSelection,
    isActive: true,
  };
}

/**
 * In-memory `/salesactivitytype` catalog. Mutations persist for the session
 * so a follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`.
 */
export const salesActivityTypeHandlers = [
  http.get('/api/v1/salesactivitytype/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = salesActivityTypes
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/salesactivitytype/:id', ({ params }) => {
    const record = findSalesActivityType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales activity type not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/salesactivitytype/:id', async ({ params, request }) => {
    const record = findSalesActivityType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales activity type not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesActivityTypeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/salesactivitytype/:id', async ({ params, request }) => {
    const record = findSalesActivityType(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Sales activity type not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesActivityTypePatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/salesactivitytype', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterSalesActivityTypes(url), url));
  }),

  http.post('/api/v1/salesactivitytype', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = salesActivityTypeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    salesActivityTypes.push(created);
    return setupOk(created, 201);
  }),
];
