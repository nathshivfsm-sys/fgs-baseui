import { http } from 'msw';
import {
  permissionCreateDtoSchema,
  permissionPatchDtoSchema,
  permissionUpdateDtoSchema,
  type PermissionDetailDto,
  type PermissionLookupDto,
  type PermissionSummaryDto,
} from '@cms/user-contract';
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

type PermissionRecord = PermissionDetailDto;

function perm(
  id: number,
  module: string,
  resource: string,
  action: string,
  name: string,
  displayOrder: number,
): PermissionRecord {
  return {
    id,
    permissionCode: `${module}.${resource}.${action}`.toUpperCase(),
    module,
    resource,
    action,
    name,
    description: null,
    displayOrder,
    isActive: true,
  };
}

function seedPermissions(): PermissionRecord[] {
  const rows: PermissionRecord[] = [];
  let id = 1;
  const modules = [
    'Dashboard',
    'Lead',
    'Work Order',
    'Quote',
    'Invoice',
    'Customer',
    'Contract',
    'Purchase Order',
  ];
  for (const mod of modules) {
    rows.push(perm(id++, 'BackOffice', mod, 'Read', `${mod} — View`, id));
    rows.push(
      perm(id++, 'BackOffice', mod, 'Write', `${mod} — Create/Edit`, id),
    );
  }
  const settings = [
    'Payroll Setting',
    'Company Setup',
    'Tax Setting',
    'Schedule Setup',
    'Invoice Configuration',
  ];
  for (const setting of settings) {
    rows.push(perm(id++, 'Settings', setting, 'Access', setting, id));
  }
  const mobileGroups: Record<string, string[]> = {
    'Scheduling & Calls': [
      'Show all calls to tech',
      'Allow tech to reschedule',
      'Allow to book calls',
    ],
    'Locations & Customers': [
      'Allow tech to search service location',
      'Allow to create service location',
    ],
    Invoice: ['Allow tech to view part cost', 'Freeze invoice after signature'],
  };
  for (const [group, labels] of Object.entries(mobileGroups)) {
    for (const label of labels) {
      rows.push(perm(id++, 'Mobile', group, 'Allow', label, id));
    }
  }
  return rows;
}

const permissions = seedPermissions();

function toSummary(record: PermissionRecord): PermissionSummaryDto {
  return { ...record };
}

function toLookup(record: PermissionRecord): PermissionLookupDto {
  return {
    id: record.id,
    permissionCode: record.permissionCode,
    module: record.module,
    resource: record.resource,
    action: record.action,
    name: record.name,
    displayOrder: record.displayOrder,
  };
}

function findPermission(id: number | undefined): PermissionRecord | undefined {
  return id === undefined
    ? undefined
    : permissions.find((record) => record.id === id);
}

function filterPermissions(url: URL): PermissionRecord[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const module = url.searchParams.get('module');
  const resource = url.searchParams.get('resource');
  const action = url.searchParams.get('action');
  const permissionCode = url.searchParams.get('permissionCode');
  const search = url.searchParams.get('search');
  return permissions.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (module && (record.module ?? '') !== module) return false;
    if (resource && (record.resource ?? '') !== resource) return false;
    if (action && (record.action ?? '') !== action) return false;
    if (
      permissionCode &&
      (record.permissionCode ?? '').toLowerCase() !==
        permissionCode.toLowerCase()
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.permissionCode,
      record.module,
      record.resource,
      record.name,
    ]);
  });
}

export const permissionHandlers = [
  http.get('/api/v1/permission/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = permissions
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/permission/:id', ({ params }) => {
    const record = findPermission(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Permission not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/permission/:id', async ({ params, request }) => {
    const record = findPermission(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Permission not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = permissionUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/permission/:id', async ({ params, request }) => {
    const record = findPermission(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Permission not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = permissionPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/permission', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterPermissions(url).map(toSummary), url));
  }),

  http.post('/api/v1/permission', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = permissionCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const created: PermissionRecord = {
      id: nextId(permissions),
      permissionCode: parsed.data.permissionCode ?? null,
      module: parsed.data.module ?? null,
      resource: parsed.data.resource ?? null,
      action: parsed.data.action ?? null,
      name: parsed.data.name ?? null,
      description: parsed.data.description ?? null,
      displayOrder: parsed.data.displayOrder ?? permissions.length + 1,
      isActive: true,
    };
    permissions.push(created);
    return setupOk(created, 201);
  }),
];
