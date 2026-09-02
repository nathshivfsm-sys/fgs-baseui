import {
  AgreementIcon,
  BellIcon,
  BriefcaseIcon,
  CheckIcon,
  ColumnsIcon,
  DashboardIcon,
  DispatchBoardIcon,
  EstimateIcon,
  InvoiceIcon,
  LeadIcon,
  LocationPinIcon,
  LockIcon,
  MailIcon,
  MessageIcon,
  OrganizationIcon,
  PaymentIcon,
  ProjectsIcon,
  ReportIcon,
  ScheduleIcon,
  SettingsBusinessTypeIcon,
  SettingsBusinessUnitIcon,
  SettingsGeneralInfoIcon,
  SettingsIcon,
  SettingsPostalCodesIcon,
  SettingsTaxStatesIcon,
  TrendingUpIcon,
  UsersIcon,
  type FigmaIconProps,
  type SettingCardTone,
} from '@cms/ui';
import type { ComponentType } from 'react';

/**
 * Only the 5 Company-tab categories have a traced Figma icon (settings-setup-page-prd.md
 * §8/§12). Every other category maps to the closest existing `@cms/ui` icon; anything
 * without a reasonable match falls back to the generic `SettingsIcon` rather than
 * inventing a new, un-sourced icon.
 */
const SETTING_ICON_MAP: Record<string, ComponentType<FigmaIconProps>> = {
  // Company — traced from Figma node 70:231
  SettingsGeneralInfoIcon,
  SettingsBusinessUnitIcon,
  SettingsTaxStatesIcon,
  SettingsPostalCodesIcon,
  SettingsBusinessTypeIcon,

  // Users & Payroll
  SettingsUserIcon: UsersIcon,
  SettingsRoleIcon: LockIcon,
  SettingsPayPeriodIcon: ScheduleIcon,
  SettingsTimeAttendanceIcon: ScheduleIcon,

  // Operations
  SettingsTradeSkillsIcon: BriefcaseIcon,
  SettingsWorkOrderBookingIcon: DispatchBoardIcon,
  SettingsJobTypeIcon: ColumnsIcon,
  SettingsBillingCategoryIcon: PaymentIcon,
  SettingsTimeslotsIcon: ScheduleIcon,
  SettingsZoneIcon: LocationPinIcon,
  SettingsResolutionCodesIcon: CheckIcon,
  SettingsTagsIcon: SettingsIcon,
  SettingsSetupDescriptionsIcon: MessageIcon,
  SettingsRecommendationStatusIcon: TrendingUpIcon,

  // Sales
  SettingsLeadIcon: LeadIcon,
  SettingsSalesPipelineStatusIcon: DashboardIcon,
  SettingsSalesActivitiesIcon: ProjectsIcon,
  SettingsSalesActivityOutcomeIcon: CheckIcon,
  SettingsSalesDispositionReasonIcon: MessageIcon,
  SettingsEstimateSettingsIcon: EstimateIcon,

  // Billing & Finance
  SettingsPaymentMethodsIcon: PaymentIcon,
  SettingsPaymentTermsIcon: ScheduleIcon,
  SettingsInvoiceSettingsIcon: InvoiceIcon,
  SettingsPricingMatrixIcon: ColumnsIcon,
  SettingsUniversalPricingIcon: TrendingUpIcon,

  // Service Agreements
  SettingsAgreementPricingComponentsIcon: AgreementIcon,
  SettingsAgreementTemplatesIcon: AgreementIcon,
  SettingsTemplateCoverageIcon: ReportIcon,
  SettingsTemplatePricingComponentsIcon: ColumnsIcon,

  // Assets & Inventory
  SettingsAssetSetupIcon: BriefcaseIcon,
  SettingsInventoryCategoriesIcon: ColumnsIcon,
  SettingsBusinessTypeInventoryMappingIcon: SettingsBusinessTypeIcon,
  SettingsInventorySetupIcon: SettingsIcon,

  // System
  SettingsEmailSmsTemplatesIcon: MailIcon,
  SettingsNotificationsIcon: BellIcon,
  SettingsIntegrationsIcon: OrganizationIcon,
  SettingsSystemSettingsIcon: SettingsIcon,
  SettingsSecuritySettingsIcon: LockIcon,
  SettingsAuditLogsIcon: ReportIcon,
};

/** Resolves a `settings.ts` `icon` name to its `@cms/ui` component, falling back to `SettingsIcon`. */
export function resolveSettingIcon(
  iconName: string,
): ComponentType<FigmaIconProps> {
  return SETTING_ICON_MAP[iconName] ?? SettingsIcon;
}

/** Exact tile tones from Figma node 70:231, the only tab with a designed tone per category. */
const COMPANY_TONE_MAP: Record<string, SettingCardTone> = {
  SettingsGeneralInfoIcon: 'blue',
  SettingsBusinessUnitIcon: 'green',
  SettingsTaxStatesIcon: 'purple',
  SettingsPostalCodesIcon: 'blue',
  SettingsBusinessTypeIcon: 'orange',
};

/** No Figma tone spec exists outside the Company tab, so tones cycle by card position. */
const TONE_CYCLE: readonly SettingCardTone[] = [
  'blue',
  'green',
  'purple',
  'orange',
  'neutral',
];

/** Resolves a card's icon-tile tone: the exact Company-tab value, or a positional cycle. */
export function resolveSettingTone(
  iconName: string,
  index: number,
): SettingCardTone {
  return COMPANY_TONE_MAP[iconName] ?? TONE_CYCLE[index % TONE_CYCLE.length];
}
