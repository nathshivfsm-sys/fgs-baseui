/** Wire envelopes shaped from the FGS Setup Service swagger DTOs. */

export const taxListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 11,
        taxCode: 'TX-STD',
        name: 'Standard Tax',
        showTaxDetail: true,
        description: 'State plus local',
        regionCode: 'TX',
        county: 'Travis',
        city: 'Austin',
        taxRate: 8.25,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const taxDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    id: 11,
    taxCode: 'TX-STD',
    name: 'Standard Tax',
    showTaxDetail: true,
    description: 'State plus local',
    regionCode: 'TX',
    county: 'Travis',
    city: 'Austin',
    taxRate: 8.25,
    isActive: true,
    taxDetails: [
      {
        id: 101,
        fgsSetupTaxAuthorityId: 21,
        taxAuthorityCode: 'TX-STATE',
        taxAuthorityName: 'Texas State',
        taxPercent: 6.25,
        effectiveFromDate: '2026-01-01',
        effectiveToDate: null,
        isActive: true,
      },
    ],
  },
  errors: [] as string[],
};

export const taxLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 11,
      taxCode: 'TX-STD',
      name: 'Standard Tax',
      taxRate: 8.25,
    },
  ],
  errors: [] as string[],
};

export const taxAuthorityListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 21,
        code: 'TX-STATE',
        name: 'Texas State',
        regionCode: 'TX',
        isExternalSystemRecord: false,
        taxPercent: 6.25,
        description: 'State sales tax',
        effectiveFromDate: '2026-01-01',
        usageCount: 4,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const taxAuthorityDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: taxAuthorityListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const zoneListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 31,
        code: 'NORTH',
        name: 'North Zone',
        description: 'North service territory',
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const zoneDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: zoneListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const nonWorkingDateListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 41,
        nonWorkingDate: '2025-01-01',
        name: "New Year's Day",
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const nonWorkingDateDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: nonWorkingDateListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const nonWorkingDateLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 41,
      nonWorkingDate: '2025-01-01',
      name: "New Year's Day",
    },
  ],
  errors: [] as string[],
};

export const zoneLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 31,
      code: 'NORTH',
      name: 'North Zone',
    },
  ],
  errors: [] as string[],
};

export const postalCodeListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 41,
        postalCode: 'NORTH',
        countryCode: 'US',
        stateProvinceCode: 'TX',
        city: 'Houston',
        tripChargeAmount: 10,
        fgsSetupZoneId: 31,
        fgsSetupTaxId: 11,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const postalCodeDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: postalCodeListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const postalCodeLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 41,
      postalCode: 'NORTH',
      city: 'Houston',
    },
  ],
  errors: [] as string[],
};

export const techTradeListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 51,
        tradeCode: 'HVAC',
        name: 'HVAC',
        sortOrder: 1,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const techTradeDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    ...techTradeListResponseFixture.data.items[0],
    description: 'Heating, ventilation, and air conditioning',
  },
  errors: [] as string[],
};

export const techTradeLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 51,
      tradeCode: 'HVAC',
      name: 'HVAC',
      sortOrder: 1,
    },
  ],
  errors: [] as string[],
};

export const glBreakListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 61,
        code: 'HQ',
        name: 'Headquarters',
        breakLabel: 'Company HQ',
        breakLevel: 1,
        logoFileId: null,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const glBreakDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    ...glBreakListResponseFixture.data.items[0],
    address: {
      id: 'aaaaaaaa-bbbb-cccc-dddd-000000000061',
      addressLine1: '100 Main St',
      addressLine2: null,
      addressLine3: null,
      addressLine4: null,
      city: 'Houston',
      state: 'TX',
      country: 'US',
      postalCode: '77002',
      formattedAddress: '100 Main St, Houston, TX 77002',
      latitude: 29.7604,
      longitude: -95.3698,
    },
    trades: [
      { id: 601, tradeCode: 'HVAC' },
      { id: 602, tradeCode: 'PLUMB' },
    ],
  },
  errors: [] as string[],
};

export const glBreakLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 61,
      code: 'HQ',
      name: 'Headquarters',
      breakLevel: 1,
    },
  ],
  errors: [] as string[],
};

export const techSkillLevelListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 61,
        code: 'MAST',
        name: 'Master',
        description: 'Senior technician',
        sortOrder: 3,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const techSkillLevelDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: techSkillLevelListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const techSkillLevelLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 61,
      code: 'MAST',
      name: 'Master',
      sortOrder: 3,
    },
  ],
  errors: [] as string[],
};

export const businessTypeListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 71,
        code: 'RES',
        name: 'Residential',
        description: 'Homes and apartments',
        displayOrder: 1,
        isActive: true,
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const businessTypeDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: businessTypeListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const businessTypeLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 71,
      code: 'RES',
      name: 'Residential',
      displayOrder: 1,
    },
  ],
  errors: [] as string[],
};

export const userListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 'a1111111-1111-4111-8111-111111111101',
        displayName: 'Alex Admin',
        email: 'alex.admin@example.com',
        phoneNumber: '+1-555-0100',
        roleId: 1,
        roleName: 'Administrator',
        invitationStatus: 'Accepted',
        isActive: true,
        lastLoginOn: '2026-03-01T12:00:00Z',
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
    summary: {
      totalUsers: 1,
      pendingInvitation: 0,
      activeRegistered: 1,
      inactive: 0,
      admins: 1,
    },
  },
  errors: [] as string[],
};

export const userDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    id: 'a1111111-1111-4111-8111-111111111101',
    displayName: 'Alex Admin',
    email: 'alex.admin@example.com',
    phoneNumber: '+1-555-0100',
    roleId: 1,
    roleName: 'Administrator',
    invitationStatus: 'Accepted',
    isActive: true,
    hasAcceptedInvitation: true,
    lastLoginOn: '2026-03-01T12:00:00Z',
  },
  errors: [] as string[],
};

export const userRoleListResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 501,
      userId: 'a1111111-1111-4111-8111-111111111101',
      fgsRoleId: 1,
      createdOn: '2026-01-15T10:00:00Z',
      createdBy: 'system',
    },
  ],
  errors: [] as string[],
};

export const userRoleDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: userRoleListResponseFixture.data[0],
  errors: [] as string[],
};

export const userRoleLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 501,
      userId: 'a1111111-1111-4111-8111-111111111101',
      fgsRoleId: 1,
    },
  ],
  errors: [] as string[],
};

export const roleListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
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
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
  },
  errors: [] as string[],
};

export const roleDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: roleListResponseFixture.data.items[0],
  errors: [] as string[],
};

export const employeeListResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    items: [
      {
        id: 81,
        userId: 'c3333333-3333-4333-8333-333333333301',
        employeeNumber: 'E-1001',
        employeeTypeId: 1,
        displayName: 'Jordan Reed',
        legalFirstName: 'Jordan',
        legalMiddleName: null,
        legalLastName: 'Reed',
        birthDate: null,
        hireDate: '2020-01-15',
        terminationDate: null,
        statusId: 1,
        personalEmail: 'jordan.reed@example.com',
        officeEmail: 'jordan.reed@field.test',
        personalPhone: null,
        officePhone: null,
        profilePhotoFileId: null,
        regularRate: 45,
        overtimeRate: 67.5,
        doubleTimeRate: 90,
        laborBurdenTypeId: null,
        laborBurdenValue: null,
        isPurchaser: false,
        notes: null,
        hasTechnicianProfile: true,
        roleId: 3,
        roleName: 'Technician',
        lastLoginOn: '2026-03-01T12:00:00Z',
      },
    ],
    page: 1,
    pageSize: 25,
    totalCount: 1,
    summary: {
      totalEmployees: 1,
      activeEmployees: 1,
      inactiveEmployees: 0,
    },
  },
  errors: [] as string[],
};

export const employeeDetailResponseFixture = {
  success: true,
  statusCode: 200,
  data: {
    id: 81,
    userId: 'c3333333-3333-4333-8333-333333333301',
    employeeNumber: 'E-1001',
    employeeTypeId: 1,
    displayName: 'Jordan Reed',
    legalFirstName: 'Jordan',
    legalMiddleName: null,
    legalLastName: 'Reed',
    birthDate: null,
    hireDate: '2020-01-15',
    terminationDate: null,
    statusId: 1,
    personalEmail: 'jordan.reed@example.com',
    officeEmail: 'jordan.reed@field.test',
    personalPhone: null,
    officePhone: null,
    address: {
      id: 'e4444444-4444-4444-8444-000000000081',
      addressLine1: '100 Main St',
      addressLine2: null,
      city: 'Houston',
      state: 'TX',
      country: 'US',
      postalCode: '77002',
    },
    profilePhotoFileId: null,
    regularRate: 45,
    overtimeRate: 67.5,
    doubleTimeRate: 90,
    laborBurdenTypeId: null,
    laborBurdenValue: null,
    isPurchaser: false,
    notes: null,
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
  },
  errors: [] as string[],
};

export const employeeLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 81,
      employeeNumber: 'E-1001',
      displayName: 'Jordan Reed',
    },
  ],
  errors: [] as string[],
};

export const roleLookupResponseFixture = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: 1,
      roleCode: 'ADMIN',
      name: 'Administrator',
      isBuiltIn: true,
      displayOrder: 1,
    },
  ],
  errors: [] as string[],
};