import type { SettingsTabKey } from './types';

export interface SettingTab {
  key: SettingsTabKey;
  label: string;
  /** Visual grouping gap before this tab (Figma node 70:257) — not a semantic boundary. */
  spacerBefore?: boolean;
}

/**
 * Tab order and labels from Figma node 70:231 — deliberately not `settings.ts`'s
 * object-key order, which lists `usersAndPayroll` before `company`.
 */
export const SETTING_TABS: readonly SettingTab[] = [
  { key: 'company', label: 'Company' },
  { key: 'usersAndPayroll', label: 'Users & Payroll' },
  { key: 'operations', label: 'Operations' },
  { key: 'sales', label: 'Sales' },
  { key: 'billingAndFinance', label: 'Billing & Finance' },
  { key: 'serviceAgreements', label: 'Service Agreements' },
  { key: 'assetsAndInventory', label: 'Assets & Inventory' },
  { key: 'system', label: 'System' },
];
