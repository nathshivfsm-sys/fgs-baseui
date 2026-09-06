export interface SettingCount {
  count: number;
  label: string;
}

export interface SettingCategory {
  title: string;
  description: string;
  /** Resolved to a `@cms/ui` icon component by `lib/resolve-setting-icon.ts`. */
  icon: string;
  totalSettings: SettingCount;
}
