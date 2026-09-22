import { http } from 'msw';
import {
  userInviteDtoSchema,
  userPatchDtoSchema,
  userUpdateDtoSchema,
  type UserDetailDto,
  type UserInviteDto,
  type UserSummaryDto,
} from '@cms/user-contract';
import {
  assignDefined,
  firstIssueMessage,
  matchesSearch,
  readJsonBody,
  readJsonObject,
  readOptionalBoolean,
  setupError,
  setupOk,
} from './util';

type UserRecord = UserDetailDto;

function seedUsers(): UserRecord[] {
  return [
    {
      id: 'a1111111-1111-4111-8111-111111111101',
      displayName: 'Alex Admin',
      email: 'alex.admin@example.com',
      phoneNumber: '+1-555-0100',
      roleId: 1,
      roleName: 'Admin',
      invitationStatus: 'Accepted',
      isActive: true,
      hasAcceptedInvitation: true,
      lastLoginOn: '2026-03-01T12:00:00Z',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111102',
      displayName: 'Sam Scheduler',
      email: 'sam.scheduler@example.com',
      phoneNumber: null,
      roleId: 2,
      roleName: 'Manager',
      invitationStatus: 'Pending',
      isActive: true,
      hasAcceptedInvitation: false,
      lastLoginOn: null,
    },
    {
      id: 'a1111111-1111-4111-8111-111111111103',
      displayName: 'Inactive User',
      email: 'inactive@example.com',
      phoneNumber: null,
      roleId: 2,
      roleName: 'Technician',
      invitationStatus: 'Accepted',
      isActive: false,
      hasAcceptedInvitation: true,
      lastLoginOn: '2025-12-01T08:00:00Z',
    },
  ];
}

const users = seedUsers();

function toSummary(record: UserRecord): UserSummaryDto {
  return {
    id: record.id,
    displayName: record.displayName,
    email: record.email,
    phoneNumber: record.phoneNumber,
    roleId: record.roleId,
    roleName: record.roleName,
    invitationStatus: record.invitationStatus,
    isActive: record.isActive,
    lastLoginOn: record.lastLoginOn,
  };
}

function findUser(id: string | undefined): UserRecord | undefined {
  return id === undefined ? undefined : users.find((record) => record.id === id);
}

function filterUsers(url: URL): UserRecord[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const email = url.searchParams.get('email');
  const displayName = url.searchParams.get('displayName');
  const roleId = url.searchParams.get('roleId');
  const search = url.searchParams.get('search');
  const roleIds = url.searchParams.getAll('roleIds');
  return users.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (email && (record.email ?? '').toLowerCase() !== email.toLowerCase()) {
      return false;
    }
    if (
      displayName &&
      !(record.displayName ?? '').toLowerCase().includes(displayName.toLowerCase())
    ) {
      return false;
    }
    if (roleId && String(record.roleId ?? '') !== roleId) return false;
    if (
      roleIds.length > 0 &&
      !roleIds.some((value) => String(record.roleId ?? '') === value)
    ) {
      return false;
    }
    return matchesSearch(search, [
      record.displayName,
      record.email,
      record.phoneNumber,
      record.roleName,
    ]);
  });
}

function createFromInvite(body: UserInviteDto, index: number): UserRecord {
  const roleId = body.roleIds?.[0] ?? null;
  return {
    id: `b2222222-2222-4222-8222-2222222222${String(10 + index).padStart(2, '0')}`,
    displayName: body.displayName ?? null,
    email: body.email ?? null,
    phoneNumber: body.phoneNumber ?? null,
    roleId,
    roleName: roleId === 1 ? 'Administrator' : 'Scheduler',
    invitationStatus: 'Pending',
    isActive: true,
    hasAcceptedInvitation: false,
    lastLoginOn: null,
  };
}

function listSummary(items: UserRecord[]) {
  return {
    totalUsers: items.length,
    pendingInvitation: items.filter((u) => !u.hasAcceptedInvitation).length,
    activeRegistered: items.filter((u) => u.isActive && u.hasAcceptedInvitation)
      .length,
    inactive: items.filter((u) => !u.isActive).length,
    admins: items.filter((u) => u.roleId === 1).length,
  };
}

export const userHandlers = [
  http.post('/api/v1/user/:id/resendinvite', ({ params }) => {
    const record = findUser(String(params['id'] ?? ''));
    if (!record) return setupError(404, 'User not found.');
    record.invitationStatus = 'Pending';
    record.hasAcceptedInvitation = false;
    return setupOk(record);
  }),

  http.get('/api/v1/user/:id', ({ params }) => {
    const record = findUser(String(params['id'] ?? ''));
    if (!record) return setupError(404, 'User not found.');
    return setupOk(record);
  }),

  http.put('/api/v1/user/:id', async ({ params, request }) => {
    const record = findUser(String(params['id'] ?? ''));
    if (!record) return setupError(404, 'User not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = userUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    if (parsed.data.roleIds?.[0] !== undefined) {
      record.roleId = parsed.data.roleIds[0] ?? null;
    }
    return setupOk(record);
  }),

  http.patch('/api/v1/user/:id', async ({ params, request }) => {
    const record = findUser(String(params['id'] ?? ''));
    if (!record) return setupError(404, 'User not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = userPatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    assignDefined(record, parsed.data);
    if (parsed.data.roleIds?.[0] !== undefined) {
      record.roleId = parsed.data.roleIds[0] ?? null;
    }
    return setupOk(record);
  }),

  http.get('/api/v1/user', ({ request }) => {
    const url = new URL(request.url);
    const filtered = filterUsers(url);
    const includeSummary = readOptionalBoolean(url, 'includeSummary') ?? false;
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 25);
    return setupOk({
      items: filtered.map(toSummary),
      page,
      pageSize,
      totalCount: filtered.length,
      ...(includeSummary ? { summary: listSummary(filtered) } : {}),
    });
  }),

  http.post('/api/v1/user', async ({ request }) => {
    const body = await readJsonBody(request);
    if (!body.ok) return body.response;
    const parsed = userInviteDtoSchema.array().safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = parsed.data.map((invite, index) => {
      const record = createFromInvite(invite, index);
      users.push(record);
      return record;
    });
    return setupOk(created, 201);
  }),
];
