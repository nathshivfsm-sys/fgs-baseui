import { http } from 'msw';
import {
  employeeCreateDtoSchema,
  employeePatchDtoSchema,
  employeeUpdateDtoSchema,
  type EmployeeAddressDetailDto,
  type EmployeeCreateDto,
  type EmployeeDetailDto,
  type EmployeeLocationWriteDto,
  type EmployeeLookupDto,
  type EmployeePatchDto,
  type EmployeeSummaryDto,
  type EmployeeTechnicianProfileDetailDto,
  type EmployeeTechnicianProfileWriteDto,
  type EmployeeUpdateDto,
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

type EmployeeRecord = EmployeeDetailDto & { isActive: boolean };

function addressIdFor(employeeId: number): string {
  return `e4444444-4444-4444-8444-${String(employeeId).padStart(12, '0')}`;
}

function blankEmployee(
  fields: Pick<
    EmployeeRecord,
    'id' | 'employeeNumber' | 'displayName' | 'isActive'
  > &
    Partial<EmployeeRecord>,
): EmployeeRecord {
  return {
    userId: null,
    employeeTypeId: 1,
    legalFirstName: null,
    legalMiddleName: null,
    legalLastName: null,
    birthDate: null,
    hireDate: null,
    terminationDate: null,
    statusId: 1,
    personalEmail: null,
    officeEmail: null,
    personalPhone: null,
    officePhone: null,
    profilePhotoFileId: null,
    regularRate: null,
    overtimeRate: null,
    doubleTimeRate: null,
    laborBurdenTypeId: null,
    laborBurdenValue: null,
    isPurchaser: false,
    notes: null,
    address: null,
    technicianProfile: null,
    roleId: null,
    roleName: null,
    lastLoginOn: null,
    ...fields,
  };
}

function seedEmployees(): EmployeeRecord[] {
  return [
    blankEmployee({
      id: 81,
      userId: 'c3333333-3333-4333-8333-333333333301',
      employeeNumber: 'E-1001',
      displayName: 'Jordan Reed',
      legalFirstName: 'Jordan',
      legalLastName: 'Reed',
      hireDate: '2020-01-15',
      personalEmail: 'jordan.reed@example.com',
      officeEmail: 'jordan.reed@field.test',
      regularRate: 45,
      overtimeRate: 67.5,
      doubleTimeRate: 90,
      isActive: true,
      address: {
        id: addressIdFor(81),
        addressLine1: '100 Main St',
        addressLine2: null,
        city: 'Houston',
        state: 'TX',
        country: 'US',
        postalCode: '77002',
      },
      technicianProfile: {
        id: 801,
        techCode: 'JR-01',
        techName: 'Jordan Reed',
        canBeScheduled: true,
        dailyCapacityHours: 8,
        dispatchZoneId: 11,
        startLocationTypeId: 1,
        startTime: '08:00:00',
        techTradeId: 10,
        techSkillId: 61,
        truckId: null,
        customerFacingPhone: '+1-555-0140',
        notes: null,
      },
      roleId: 3,
      roleName: 'Technician',
      lastLoginOn: '2026-03-01T12:00:00Z',
    }),
    blankEmployee({
      id: 82,
      employeeNumber: 'E-1002',
      displayName: 'Sam Scheduler',
      legalFirstName: 'Sam',
      legalLastName: 'Scheduler',
      employeeTypeId: 2,
      statusId: 1,
      isPurchaser: true,
      isActive: true,
      roleId: 2,
      roleName: 'Scheduler',
    }),
    blankEmployee({
      id: 83,
      employeeNumber: 'E-1003',
      displayName: 'Alex Admin',
      employeeTypeId: 1,
      isActive: true,
      roleId: 1,
      roleName: 'Administrator',
    }),
    blankEmployee({
      id: 84,
      employeeNumber: 'E-1004',
      displayName: 'Inactive Tech',
      statusId: 2,
      terminationDate: '2025-11-01',
      isActive: false,
      roleId: 3,
      roleName: 'Technician',
    }),
  ];
}

const employees = seedEmployees();

function toSummary(record: EmployeeRecord): EmployeeSummaryDto {
  return {
    id: record.id,
    userId: record.userId,
    employeeNumber: record.employeeNumber,
    employeeTypeId: record.employeeTypeId,
    displayName: record.displayName,
    legalFirstName: record.legalFirstName,
    legalMiddleName: record.legalMiddleName,
    legalLastName: record.legalLastName,
    birthDate: record.birthDate,
    hireDate: record.hireDate,
    terminationDate: record.terminationDate,
    statusId: record.statusId,
    personalEmail: record.personalEmail,
    officeEmail: record.officeEmail,
    personalPhone: record.personalPhone,
    officePhone: record.officePhone,
    profilePhotoFileId: record.profilePhotoFileId,
    regularRate: record.regularRate,
    overtimeRate: record.overtimeRate,
    doubleTimeRate: record.doubleTimeRate,
    laborBurdenTypeId: record.laborBurdenTypeId,
    laborBurdenValue: record.laborBurdenValue,
    isPurchaser: record.isPurchaser,
    notes: record.notes,
    hasTechnicianProfile: record.technicianProfile != null,
    roleId: record.roleId,
    roleName: record.roleName,
    lastLoginOn: record.lastLoginOn,
  };
}

function toLookup(record: EmployeeRecord): EmployeeLookupDto {
  return {
    id: record.id,
    employeeNumber: record.employeeNumber,
    displayName: record.displayName,
  };
}

function toDetail(record: EmployeeRecord): EmployeeDetailDto {
  return {
    id: record.id,
    userId: record.userId,
    employeeNumber: record.employeeNumber,
    employeeTypeId: record.employeeTypeId,
    displayName: record.displayName,
    legalFirstName: record.legalFirstName,
    legalMiddleName: record.legalMiddleName,
    legalLastName: record.legalLastName,
    birthDate: record.birthDate,
    hireDate: record.hireDate,
    terminationDate: record.terminationDate,
    statusId: record.statusId,
    personalEmail: record.personalEmail,
    officeEmail: record.officeEmail,
    personalPhone: record.personalPhone,
    officePhone: record.officePhone,
    address: record.address,
    profilePhotoFileId: record.profilePhotoFileId,
    regularRate: record.regularRate,
    overtimeRate: record.overtimeRate,
    doubleTimeRate: record.doubleTimeRate,
    laborBurdenTypeId: record.laborBurdenTypeId,
    laborBurdenValue: record.laborBurdenValue,
    isPurchaser: record.isPurchaser,
    notes: record.notes,
    technicianProfile: record.technicianProfile,
    roleId: record.roleId,
    roleName: record.roleName,
    lastLoginOn: record.lastLoginOn,
  };
}

function findEmployee(id: number | undefined): EmployeeRecord | undefined {
  return id === undefined
    ? undefined
    : employees.find((record) => record.id === id);
}

function readIdList(url: URL, key: string): string[] {
  return url.searchParams.getAll(key);
}

function matchesId(
  value: number | null | undefined,
  ids: readonly string[],
): boolean {
  if (ids.length === 0) return true;
  return ids.some((id) => String(value ?? '') === id);
}

function filterEmployees(url: URL): EmployeeRecord[] {
  const isActive = readOptionalBoolean(url, 'isActive');
  const employeeNumber = url.searchParams.get('employeeNumber');
  const employeeTypeId = url.searchParams.get('employeeTypeId');
  const statusId = url.searchParams.get('statusId');
  const search = url.searchParams.get('search');
  const techTradeIds = readIdList(url, 'techTradeIds');
  const techSkillIds = readIdList(url, 'techSkillIds');
  const dispatchZoneIds = readIdList(url, 'dispatchZoneIds');
  const roleIds = readIdList(url, 'roleIds');
  return employees.filter((record) => {
    if (isActive !== undefined && record.isActive !== isActive) return false;
    if (
      employeeNumber &&
      (record.employeeNumber ?? '').toLowerCase() !==
        employeeNumber.toLowerCase()
    ) {
      return false;
    }
    if (
      employeeTypeId &&
      String(record.employeeTypeId) !== employeeTypeId
    ) {
      return false;
    }
    if (statusId && String(record.statusId) !== statusId) return false;
    if (!matchesId(record.technicianProfile?.techTradeId, techTradeIds)) {
      return false;
    }
    if (!matchesId(record.technicianProfile?.techSkillId, techSkillIds)) {
      return false;
    }
    if (
      !matchesId(record.technicianProfile?.dispatchZoneId, dispatchZoneIds)
    ) {
      return false;
    }
    if (!matchesId(record.roleId, roleIds)) return false;
    return matchesSearch(search, [
      record.displayName,
      record.employeeNumber,
      record.legalFirstName,
      record.legalLastName,
      record.personalEmail,
      record.officeEmail,
    ]);
  });
}

function listSummary(items: readonly EmployeeRecord[]) {
  const activeEmployees = items.filter((item) => item.isActive).length;
  return {
    totalEmployees: items.length,
    activeEmployees,
    inactiveEmployees: items.length - activeEmployees,
  };
}

function toAddressDetail(
  address: EmployeeLocationWriteDto,
  id: string,
): EmployeeAddressDetailDto {
  return {
    id,
    addressLine1: address.addressLine1 ?? null,
    addressLine2: address.addressLine2 ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    country: address.country ?? null,
    postalCode: address.postalCode ?? null,
  };
}

function nextProfileId(): number {
  return (
    employees.reduce(
      (max, record) => Math.max(max, record.technicianProfile?.id ?? 0),
      800,
    ) + 1
  );
}

function toTechnicianDetail(
  body: EmployeeTechnicianProfileWriteDto,
  id: number,
): EmployeeTechnicianProfileDetailDto {
  return {
    id,
    techCode: body.techCode ?? null,
    techName: body.techName ?? null,
    canBeScheduled: body.canBeScheduled,
    dailyCapacityHours: body.dailyCapacityHours ?? 0,
    dispatchZoneId: body.dispatchZoneId ?? null,
    startLocationTypeId: body.startLocationTypeId,
    startTime: body.startTime ?? null,
    techTradeId: body.techTradeId ?? null,
    techSkillId: body.techSkillId ?? null,
    truckId: body.truckId ?? null,
    customerFacingPhone: body.customerFacingPhone ?? null,
    notes: body.notes ?? null,
  };
}

function applyEmployeeWrite(
  record: EmployeeRecord,
  body: EmployeeCreateDto | EmployeeUpdateDto | EmployeePatchDto,
) {
  const { address, technicianProfile, ...rest } = body;
  assignDefined(record, rest);
  if (address) {
    record.address = toAddressDetail(
      address,
      record.address?.id ?? addressIdFor(record.id),
    );
  } else if (address === null) {
    record.address = null;
  }
  if (technicianProfile) {
    record.technicianProfile = toTechnicianDetail(
      technicianProfile,
      record.technicianProfile?.id ?? nextProfileId(),
    );
  } else if (technicianProfile === null) {
    record.technicianProfile = null;
  }
}

function createFromBody(body: EmployeeCreateDto): EmployeeRecord {
  const record = blankEmployee({
    id: nextId(employees),
    employeeNumber: body.employeeNumber ?? null,
    displayName: body.displayName ?? null,
    isActive: true,
  });
  applyEmployeeWrite(record, body);
  return record;
}

/**
 * In-memory `/employee` catalog. Mutations persist for the session so a
 * follow-up GET after invalidation shows the saved values. Request/response
 * shapes come from `@cms/settings-contract`. `isActive` is stored for list
 * and lookup filters; swagger summary and detail omit it.
 */
export const employeeHandlers = [
  http.get('/api/v1/employee/lookup', ({ request }) => {
    const url = new URL(request.url);
    const activeOnly = readOptionalBoolean(url, 'activeOnly') ?? true;
    const items = employees
      .filter((record) => (activeOnly ? record.isActive : true))
      .map(toLookup);
    return setupOk(items);
  }),

  http.get('/api/v1/employee/:id', ({ params }) => {
    const record = findEmployee(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Employee not found.');
    return setupOk(toDetail(record));
  }),

  http.put('/api/v1/employee/:id', async ({ params, request }) => {
    const record = findEmployee(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Employee not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = employeeUpdateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    applyEmployeeWrite(record, parsed.data);
    return setupOk(toDetail(record));
  }),

  http.patch('/api/v1/employee/:id', async ({ params, request }) => {
    const record = findEmployee(parseRouteId(params['id']));
    if (!record) return setupError(404, 'Employee not found.');
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = employeePatchDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    applyEmployeeWrite(record, parsed.data);
    return setupOk(toDetail(record));
  }),

  http.get('/api/v1/employee', ({ request }) => {
    const url = new URL(request.url);
    const filtered = filterEmployees(url);
    const includeSummary = readOptionalBoolean(url, 'includeSummary') ?? true;
    return setupOk({
      ...pagedResult(filtered.map(toSummary), url),
      ...(includeSummary ? { summary: listSummary(filtered) } : {}),
    });
  }),

  http.post('/api/v1/employee', async ({ request }) => {
    const body = await readJsonObject(request);
    if (!body.ok) return body.response;
    const parsed = employeeCreateDtoSchema.safeParse(body.value);
    if (!parsed.success) return setupError(400, firstIssueMessage(parsed.error));
    const created = createFromBody(parsed.data);
    employees.push(created);
    return setupOk(toDetail(created), 201);
  }),
];
