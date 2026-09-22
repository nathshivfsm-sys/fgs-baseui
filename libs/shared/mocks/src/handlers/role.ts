import { http } from 'msw';
import {
  roleCloneDtoSchema,
  roleCreateDtoSchema,
  rolePatchDtoSchema,
  roleUpdateDtoSchema,
  type RoleCreateDto,
  type RoleDetailDto,
  type RoleLookupDto,
  type RoleSummaryDto,
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

type RoleRecord = RoleDetailDto;

function seedRoles(): RoleRecord[] {
  return [
    {
      id: 1,
      roleCode: 'ADMIN',
      name: 'Administrator',
      description: 'Full access',
      parentRoleId: null,
      isBuiltIn: true,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      roleCode: 'SCHED',
      name: 'Scheduler',
      description: 'Dispatch and scheduling',
      parentRoleId: null,
      isBuiltIn: false,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 3,
      roleCode: 'TECH',
      name: 'Technician',
      description: 'Field technician',
      parentRoleId: 2,
      isBuiltIn: false,
      displayOrder: 3,
      isActive: false,
    },
  ];
}

const roles = seedRoles();

function toSummary(record: RoleRecord): RoleSummaryDto {
  return {
    id: record.id,
    roleCode: record.roleCode,
    name: record.name,
    description: record.description,
    parentRoleId: record.parentRoleId,
    isBuiltIn: record.isBuiltIn,
    displayOrder: record.displayOrder,
    isActive: record.isActive,
  };
}

function toLookup(record: RoleRecord): RoleLookupDto {
  return {
    id: record.id,
    roleCode: record.roleCode,
    name: record.name,
    isBuiltIn: record.isBuiltIn,
    displayOrder: record.displayOrder,
  };
}

function findRole(id: number | undefined): RoleRecord | undefined {
  return id === undefined ? undefined : roles.find((record) => record.id === id);
}

function filterRoles(url: URL): RoleRecord[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const isBuiltIn = readOptionalBoolean(url, 'isBuiltIn');
  const roleCode = url.searchParams.get('roleCode');
  const name = url.searchParams.get('name');
  const search = url.searchParams.get('search');
  return roles.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (isBuiltIn !== undefined && record.isBuiltIn !== isBuiltIn) return false;
    if (
      roleCode &&
      (record.roleCode ?? '').toLowerCase() !== roleCode.toLowerCase()
    ) {
      return false;
    }
    if (name && !(record.name ?? '').toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    return matchesSearch(search, [record.roleCode, record.name, record.description]);
  });
}

function createFromBody(body: RoleCreateDto): RoleRecord {
  return {
    id: nextId(roles),
    roleCode: body.roleCode ?? null,
    name: body.name ?? null,
    description: body.description ?? null,
    parentRoleId: body.parentRoleId ?? null,
    isBuiltIn: false,
    displayOrder: body.displayOrder,
    isActive: true,
  };
}

export const roleHandlers = [
  http.get('/api/v1/role/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = roles
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.post('/api/v1/role/:id/clone', async ({ params, request }) => {
    const source = findRole(parseRouteId(params['id']));
    if (!source) return setupError(404, 'Role not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = roleCloneDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const cloned: RoleRecord = {
      id: nextId(roles),
      roleCode: parsed.data.roleCode ?? `${source.roleCode}-COPY`,
      name: parsed.data.name ?? `${source.name ?? 'Role'} Copy`,
      description: parsed.data.description ?? source.description,
      parentRoleId: source.parentRoleId,
      isBuiltIn: false,
      displayOrder: parsed.data.displayOrder ?? source.displayOrder,
      isActive: true,
    };
    roles.push(cloned);
    return setupOk(cloned, 201);
  }),

  http.get('/api/v1/role/:id', ({ params }) => {
    const record = findRole(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Role not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/role/:id', async ({ params, request }) => {
    const record = findRole(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Role not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = roleUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/role/:id', async ({ params, request }) => {
    const record = findRole(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Role not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = rolePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/role', ({ request }) => {
    const url = new URL(request.url);
    return setupOk(pagedResult(filterRoles(url).map(toSummary), url));
  }),

  http.post('/api/v1/role', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = roleCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    roles.push(created);
    return setupOk(created, 201);
  }),
];
