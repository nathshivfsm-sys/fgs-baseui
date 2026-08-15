import type { UserDetails } from '@cms/platform-contract';

export const DEFAULT_TENANT_ID = 'northwind';

export const TENANT_NAMES: Readonly<Record<string, string>> = Object.freeze({
  northwind: 'Northwind Facilities',
  contoso: 'Contoso Home Services',
});

export const MOCK_CURRENT_USER = Object.freeze({
  id: 'user-1001',
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  role: 'Operations Manager',
} satisfies UserDetails);
