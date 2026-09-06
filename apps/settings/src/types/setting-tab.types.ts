export type SettingsTabKey =
  | 'company'
  | 'usersAndPayroll'
  | 'operations'
  | 'sales'
  | 'billingAndFinance'
  | 'serviceAgreements'
  | 'assetsAndInventory'
  | 'system';

export interface SettingTab {
  key: SettingsTabKey;
  label: string;
  /** Visual grouping gap before this tab (Figma node 70:257) — not a semantic boundary. */
  spacerBefore?: boolean;
}
