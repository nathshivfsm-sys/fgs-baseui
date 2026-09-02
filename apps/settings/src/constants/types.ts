export interface SettingCount {
  count: number;
  label: string;
}

export interface SettingCategory {
  title: string;
  description: string;
  /** Resolved to a `@cms/ui` icon component by `setting-icons.tsx`. */
  icon: string;
  totalSettings: SettingCount;
}

export type SettingsTabKey =
  | 'company'
  | 'usersAndPayroll'
  | 'operations'
  | 'sales'
  | 'billingAndFinance'
  | 'serviceAgreements'
  | 'assetsAndInventory'
  | 'system';
