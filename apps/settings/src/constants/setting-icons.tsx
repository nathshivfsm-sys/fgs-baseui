import {
  AgreementIcon,
  BellIcon,
  BriefcaseIcon,
  CheckIcon,
  ColumnsIcon,
  InvoiceIcon,
  LockIcon,
  MailIcon,
  MessageIcon,
  OrganizationIcon,
  PaymentIcon,
  ReportIcon,
  ScheduleIcon,
  SettingsBusinessTypeIcon,
  SettingsBusinessUnitIcon,
  SettingsBillingCategoryIcon,
  SettingsEstimateSettingsIcon,
  SettingsGeneralInfoIcon,
  SettingsIcon,
  SettingsJobTypeIcon,
  SettingsLeadIcon,
  SettingsPayPeriodIcon,
  SettingsPostalCodesIcon,
  SettingsRecommendationStatusIcon,
  SettingsResolutionCodesIcon,
  SettingsRoleIcon,
  SettingsSalesActivitiesIcon,
  SettingsSalesPipelineStatusIcon,
  SettingsSetupDescriptionsIcon,
  SettingsTagsIcon,
  SettingsTaxStatesIcon,
  SettingsTimeAttendanceIcon,
  SettingsTimeslotsIcon,
  SettingsTradeSkillsIcon,
  SettingsUserIcon,
  SettingsWorkOrderBookingIcon,
  SettingsZoneIcon,
  TrendingUpIcon,
  type FigmaIconProps,
  type SettingCardTone,
} from '@cms/ui';
import type { ComponentType } from 'react';

/**
 * Figma-traced icon mappings for Settings categories (18 icons from Figma).
 * Remaining icons fall back to closest existing `@cms/ui` icons until their Figma designs are traced.
 */
const SETTING_ICON_MAP: Record<string, ComponentType<FigmaIconProps>> = {
  // Company — traced from Figma node 70:231
  SettingsGeneralInfoIcon,
  SettingsBusinessUnitIcon,
  SettingsTaxStatesIcon,
  SettingsPostalCodesIcon,
  SettingsBusinessTypeIcon,

  // Users & Payroll — traced from Figma
  SettingsUserIcon,
  SettingsRoleIcon,
  SettingsPayPeriodIcon,
  SettingsTimeAttendanceIcon,

  // Operations — traced from Figma
  SettingsTradeSkillsIcon,
  SettingsWorkOrderBookingIcon,
  SettingsJobTypeIcon,
  SettingsBillingCategoryIcon,
  SettingsTimeslotsIcon,
  SettingsZoneIcon,
  SettingsResolutionCodesIcon,
  SettingsTagsIcon,
  SettingsSetupDescriptionsIcon,
  SettingsRecommendationStatusIcon,

  // Sales — partially traced from Figma (18/39 icons complete)
  SettingsLeadIcon,
  SettingsSalesPipelineStatusIcon,
  SettingsSalesActivitiesIcon,
  SettingsSalesActivityOutcomeIcon: CheckIcon,
  SettingsSalesDispositionReasonIcon: MessageIcon,
  SettingsEstimateSettingsIcon,

  // Billing & Finance — fallback icons (Figma designs pending)
  SettingsPaymentMethodsIcon: PaymentIcon,
  SettingsPaymentTermsIcon: ScheduleIcon,
  SettingsInvoiceSettingsIcon: InvoiceIcon,
  SettingsPricingMatrixIcon: ColumnsIcon,
  SettingsUniversalPricingIcon: TrendingUpIcon,

  // Service Agreements — fallback icons (Figma designs pending)
  SettingsAgreementPricingComponentsIcon: AgreementIcon,
  SettingsAgreementTemplatesIcon: AgreementIcon,
  SettingsTemplateCoverageIcon: ReportIcon,
  SettingsTemplatePricingComponentsIcon: ColumnsIcon,

  // Assets & Inventory — fallback icons (Figma designs pending)
  SettingsAssetSetupIcon: BriefcaseIcon,
  SettingsInventoryCategoriesIcon: ColumnsIcon,
  SettingsBusinessTypeInventoryMappingIcon: SettingsBusinessTypeIcon,
  SettingsInventorySetupIcon: SettingsIcon,

  // System — fallback icons (Figma designs pending)
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
