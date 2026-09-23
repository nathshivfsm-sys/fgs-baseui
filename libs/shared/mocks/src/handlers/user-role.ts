import { http } from 'msw';
import {
  userRoleCreateDtoSchema,
  userRolePatchDtoSchema,
  userRoleSyncDtoSchema,
  userRoleUpdateDtoSchema,
  type UserRoleDetailDto,
  type UserRoleLookupDto,
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

function seedUserRoles(): UserRoleDetailDto[] {
  return [
    {
      id: 501,
      userId: 'a1111111-1111-4111-8111-111111111101',
      fgsRoleId: 1,
      createdOn: '2026-01-15T10:00:00Z',
      createdBy: 'system',
    },
    {
      id: 502,
      userId: 'a1111111-1111-4111-8111-111111111102',
      fgsRoleId: 2,
      createdOn: '2026-02-01T10:00:00Z',
      createdBy: 'alex.admin@example.com',
    },
  ];
}

const userRoles = seedUserRoles();

function toLookup(record: UserRoleDetailDto): UserRoleLookupDto {
  return {
    id: record.id,
    userId: record.userId,
    fgsRoleId: record.fgsRoleId,
  };
}

function findUserRole(id: number | undefined): UserRoleDetailDto | undefined {
  return id === undefined
    ? undefined
    : userRoles.find((record) => record.id === id);
}

function rolesForUser(userId: string): UserRoleDetailDto[] {
  return userRoles.filter((record) => record.userId === userId);
}

export const userRoleHandlers = [
  http.get('/api/v1/userrole/lookup', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const items = userRoles
      .filter((record) => (userId ? record.userId === userId : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/userrole/item/:id', ({ params }) => {
    const record = findUserRole(parseRouteId(params['id']));
    if (!record) return setupError(404, 'User role not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/userrole/item/:id', async ({ params, request }) => {
    const record = findUserRole(parseRouteId(params['id']));
    if (!record) return setupError(404, 'User role not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = userRoleUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.patch('/api/v1/userrole/item/:id', async ({ params, request }) => {
    const record = findUserRole(parseRouteId(params['id']));
    if (!record) return setupError(404, 'User role not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = userRolePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    return setupOk(record);
  }),

  http.get('/api/v1/userrole/:userId', ({ params }) => {
    const userId = String(params['userId'] ?? '');
    if (userId === 'item') return setupError(404, 'User role not found.');
    return setupOk(rolesForUser(userId));
  }),

  http.post('/api/v1/userrole', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = userRoleCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const duplicate = userRoles.find(
      (record) =>
        record.userId === parsed.data.userId &&
        record.fgsRoleId === parsed.data.fgsRoleId,
    );
    if (duplicate) return setupError(409, 'User role already exists.');
    const created: UserRoleDetailDto = {
      id: nextId(userRoles),
      userId: parsed.data.userId,
      fgsRoleId: parsed.data.fgsRoleId,
      createdOn: new Date().toISOString(),
      createdBy: 'mock',
    };
    userRoles.push(created);
    return setupOk(created, 201);
  }),

  http.put('/api/v1/userrole', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = userRoleSyncDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    for (let index = userRoles.length - 1; index >= 0; index -= 1) {
      if (userRoles[index]?.userId === parsed.data.userId) {
        userRoles.splice(index, 1);
      }
    }
    const synced = (parsed.data.fgsRoleIds ?? []).map((fgsRoleId) => {
      const created: UserRoleDetailDto = {
        id: nextId(userRoles),
        userId: parsed.data.userId,
        fgsRoleId,
        createdOn: new Date().toISOString(),
        createdBy: 'mock',
      };
      userRoles.push(created);
      return created;
    });
    return setupOk(synced);
  }),
];
