import { http } from 'msw';
import {
  rolePermissionCreateDtoSchema,
  rolePermissionPatchDtoSchema,
  rolePermissionSyncDtoSchema,
  rolePermissionUpdateDtoSchema,
  type RolePermissionDetailDto,
  type RolePermissionLookupDto,
} from '@cms/user-contract';
import {
  assignDefined,
  firstIssueMessage,
  nextId,
  parseRouteId,
  readJsonObject,
  setupError,
  setupOk,
} from './util';

function seedPermission(id: number) {
  return {
    id,
    permissionCode: `PERM-${id}`,
    module: 'Settings',
    resource: 'Role',
    action: 'Read',
    name: `Permission ${id}`,
    description: `Mock permission ${id}`,
    displayOrder: id,
    isActive: true,
  };
}

function seedRolePermissions(): RolePermissionDetailDto[] {
  return [
    {
      id: 601,
      fgsRoleId: 1,
      fgsPermissionId: 10,
      createdOn: '2026-01-15T10:00:00Z',
      createdBy: 'system',
      permission: seedPermission(10),
    },
    {
      id: 602,
      fgsRoleId: 1,
      fgsPermissionId: 11,
      createdOn: '2026-01-16T10:00:00Z',
      createdBy: 'system',
      permission: seedPermission(11),
    },
    {
      id: 603,
      fgsRoleId: 2,
      fgsPermissionId: 10,
      createdOn: '2026-02-01T10:00:00Z',
      createdBy: 'alex.admin@example.com',
      permission: seedPermission(10),
    },
  ];
}

const rolePermissions = seedRolePermissions();

function toLookup(record: RolePermissionDetailDto): RolePermissionLookupDto {
  return {
    id: record.id,
    fgsRoleId: record.fgsRoleId,
    fgsPermissionId: record.fgsPermissionId,
  };
}

function findRolePermission(
  id: number | undefined,
): RolePermissionDetailDto | undefined {
  return id === undefined
    ? undefined
    : rolePermissions.find((record) => record.id === id);
}

function permissionsForRole(fgsRoleId: number): RolePermissionDetailDto[] {
  return rolePermissions.filter((record) => record.fgsRoleId === fgsRoleId);
}

export const rolePermissionHandlers = [
  http.get('/api/v1/rolepermission/lookup', ({ request }) => {
    const url = new URL(request.url);
    const fgsRoleId = url.searchParams.get('fgsRoleId');
    const roleId =
      fgsRoleId === null ? undefined : Number.parseInt(fgsRoleId, 10);
    const items = rolePermissions
      .filter((record) =>
        roleId === undefined || Number.isNaN(roleId)
          ? true
          : record.fgsRoleId === roleId,
      )
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/rolepermission/item/:id', ({ params }) => {
    const record = findRolePermission(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Role permission not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/rolepermission/item/:id', async ({ params, request }) => {
    const record = findRolePermission(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Role permission not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = rolePermissionUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    record.permission = seedPermission(parsed.data.fgsPermissionId);
    return setupOk(record);
  }),

  http.patch('/api/v1/rolepermission/item/:id', async ({ params, request }) => {
    const record = findRolePermission(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Role permission not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = rolePermissionPatchDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    if (parsed.data.fgsPermissionId != null) {
      record.permission = seedPermission(parsed.data.fgsPermissionId);
    }
    return setupOk(record);
  }),

  http.get('/api/v1/rolepermission/:fgsRoleId', ({ params }) => {
    const segment = String(params['fgsRoleId'] ?? '');
    if (segment === 'item' || segment === 'lookup') {
      return setupError(404, 'Role permission not found.');
    }
    const fgsRoleId = Number.parseInt(segment, 10);
    if (Number.isNaN(fgsRoleId)) {
      return setupError(404, 'Role permission not found.');
    }
    return setupOk(permissionsForRole(fgsRoleId));
  }),

  http.post('/api/v1/rolepermission', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = rolePermissionCreateDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    const duplicate = rolePermissions.find(
      (record) =>
        record.fgsRoleId === parsed.data.fgsRoleId &&
        record.fgsPermissionId === parsed.data.fgsPermissionId,
    );
    if (duplicate) return setupError(409, 'Role permission already exists.');
    const created: RolePermissionDetailDto = {
      id: nextId(rolePermissions),
      fgsRoleId: parsed.data.fgsRoleId,
      fgsPermissionId: parsed.data.fgsPermissionId,
      createdOn: new Date().toISOString(),
      createdBy: 'mock',
      permission: seedPermission(parsed.data.fgsPermissionId),
    };
    rolePermissions.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/rolepermission', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = rolePermissionSyncDtoSchema.safeParse(body.value);
    if (!parsed.success)
      return setupError(400, firstIssueMessage(parsed.error));
    for (let index = rolePermissions.length - 1; index >= 0; index -= 1) {
      if (rolePermissions[index]?.fgsRoleId === parsed.data.fgsRoleId) {
        rolePermissions.splice(index, 1);
      }
    }
    const synced = (parsed.data.fgsPermissionIds ?? []).map(
      (fgsPermissionId: number) => {
        const created: RolePermissionDetailDto = {
          id: nextId(rolePermissions),
          fgsRoleId: parsed.data.fgsRoleId,
          fgsPermissionId,
          createdOn: new Date().toISOString(),
          createdBy: 'mock',
          permission: seedPermission(fgsPermissionId),
        };
        rolePermissions.push(created);
        return created;
      },
    );
    return setupOk(synced);
  }),
];
