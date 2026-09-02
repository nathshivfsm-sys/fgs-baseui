import type { SettingCategory, SettingsTabKey } from './types';

export const allSettings: Record<SettingsTabKey, SettingCategory[]> = {
    usersAndPayroll: [
      {
          title: 'Users',
          description: 'Create and manage system users, status, assignments, and defaults.',
          icon: "SettingsUserIcon",
          totalSettings: { count: 42, label: 'Users' },
      },
      {
          title: 'Roles & Permissions',
          description: 'Define roles and control access across the system.',
          icon: "SettingsRoleIcon",
          totalSettings: { count: 14, label: 'Roles' },
      },
      {
          title: 'Pay Period Setup',
          description: 'Configure pay periods, payroll cycles, and processing calendars.',
          icon: "SettingsPayPeriodIcon",
          totalSettings: { count: 4, label: 'Pay Periods' },
      },
      {
          title: 'Time & Attendance',
          description: 'Configure technician time tracking, attendance, and time-card policies.',
          icon: "SettingsTimeAttendanceIcon",
          totalSettings: { count: 9, label: 'Settings' },
      },
    ],

    company: [
      {
          title: 'General Info',
          description: 'Configure company details, branding, contact information, and business preferences.',
          icon: "SettingsGeneralInfoIcon",
          totalSettings: { count: 12, label: 'Settings' },
      },
      {
          title: 'Business Unit',
          description: 'Manage business divisions, branches, or departments used across operations.',
          icon: "SettingsBusinessUnitIcon",
          totalSettings: { count: 8, label: 'Units' },
      },
      {
          title: 'Tax & States',
          description: 'Configure tax jurisdictions, rates, and state-level settings.',
          icon: "SettingsTaxStatesIcon",
          totalSettings: { count: 26, label: 'Rules' },
      },
      {
          title: 'Postal Codes',
          description: 'Manage postal codes used for service zones and automated territory assignment.',
          icon: "SettingsPostalCodesIcon",
          totalSettings: { count: 1842, label: 'Codes' },
      },
      {
          title: 'Business Type',
          description: 'Define the business types supported by your company.',
          icon: "SettingsBusinessTypeIcon",
          totalSettings: { count: 8, label: 'Types' },
      },
    ],

    operations: [
      {
          title: 'Trade & Skills',
          description: 'Define trades and technician skills used for service qualification.',
          icon: "SettingsTradeSkillsIcon",
          totalSettings: { count: 18, label: 'Trades • 96 Skills' },
      },
      {
          title: 'Work Order & Booking',
          description: 'Configure booking workflow, work-order defaults, and behavior.',
          icon: "SettingsWorkOrderBookingIcon",
          totalSettings: { count: 14, label: 'Settings' },
      },
      {
          title: 'Job Type',
          description: 'Define the types of jobs your company performs.',
          icon: "SettingsJobTypeIcon",
          totalSettings: { count: 22, label: 'Job Types' },
      },
      {
          title: 'Billing Category',
          description: 'Configure billing categories used for services and parts.',
          icon: "SettingsBillingCategoryIcon",
          totalSettings: { count: 16, label: 'Categories' },
      },
      {
          title: 'Timeslots',
          description: 'Create and manage customer booking windows.',
          icon: "SettingsTimeslotsIcon",
          totalSettings: { count: 28, label: 'Timeslots' },
      },
      {
          title: 'Zone',
          description: 'Define service territories used for scheduling and dispatch.',
          icon: "SettingsZoneIcon",
          totalSettings: { count: 24, label: 'Zones' },
      },
      {
          title: 'Resolution Codes',
          description: 'Manage standard resolution outcomes for completed work.',
          icon: "SettingsResolutionCodesIcon",
          totalSettings: { count: 52, label: 'Codes' },
      },
      {
          title: 'Tags',
          description: 'Create and manage operational tags for classification.',
          icon: "SettingsTagsIcon",
          totalSettings: { count: 66, label: 'Tags' },
      },
      {
          title: 'Setup Descriptions',
          description: 'Manage reason-for-call and resolution descriptions.',
          icon: "SettingsSetupDescriptionsIcon",
          totalSettings: { count: 32, label: 'Descriptions' },
      },
      {
          title: 'Recommendation Status',
          description: 'Define recommendation statuses used across service workflows.',
          icon: "SettingsRecommendationStatusIcon",
          totalSettings: { count: 6, label: 'Statuses' },
      },
    ],

    sales: [
      {
          title: 'Lead',
          description: 'Configure lead sources, statuses, and qualification defaults.',
          icon: "SettingsLeadIcon",
          totalSettings: { count: 14, label: 'Settings' },
      },
      {
          title: 'Sales Pipeline Status',
          description: 'Manage sales pipeline stages.',
          icon: "SettingsSalesPipelineStatusIcon",
          totalSettings: { count: 7, label: 'Stages' },
      },
      {
          title: 'Sales Activities',
          description: 'Manage activities performed by the sales team.',
          icon: "SettingsSalesActivitiesIcon",
          totalSettings: { count: 24, label: 'Activities' },
      },
      {
          title: 'Sales Activity Outcome',
          description: 'Define standard outcomes for sales activities.',
          icon: "SettingsSalesActivityOutcomeIcon",
          totalSettings: { count: 12, label: 'Outcomes' },
      },
      {
          title: 'Sales Disposition Reason',
          description: 'Manage reasons for sales disposition.',
          icon: "SettingsSalesDispositionReasonIcon",
          totalSettings: { count: 18, label: 'Reasons' },
      },
      {
          title: 'Estimate Settings',
          description: 'Configure estimate numbering, terms, templates, and options.',
          icon: "SettingsEstimateSettingsIcon",
          totalSettings: { count: 17, label: 'Settings' },
      },
    ],

    billingAndFinance: [
      {
          title: 'Payment Methods',
          description: 'Configure payment methods accepted from customers.',
          icon: "SettingsPaymentMethodsIcon",
          totalSettings: { count: 9, label: 'Methods' },
      },
      {
          title: 'Payment Terms',
          description: 'Manage due dates and customer payment terms.',
          icon: "SettingsPaymentTermsIcon",
          totalSettings: { count: 10, label: 'Terms' },
      },
      {
          title: 'Invoice Settings',
          description: 'Configure invoice numbering, prefixes, and defaults.',
          icon: "SettingsInvoiceSettingsIcon",
          totalSettings: { count: 15, label: 'Settings' },
      },
      {
          title: 'Pricing Matrix',
          description: 'Configure pricing rules for labor, parts, and services.',
          icon: "SettingsPricingMatrixIcon",
          totalSettings: { count: 8, label: 'Matrices' },
      },
      {
          title: 'Universal Pricing',
          description: 'Manage universal pricing rules used across the company.',
          icon: "SettingsUniversalPricingIcon",
          totalSettings: { count: 5, label: 'Rules' },
      },
    ],

    serviceAgreements: [
      {
          title: 'Agreement Pricing Components',
          description: 'Manage pricing components used in service agreements.',
          icon: "SettingsAgreementPricingComponentsIcon",
          totalSettings: { count: 24, label: 'Components' },
      },
      {
          title: 'Agreement Templates',
          description: 'Create and manage reusable service agreement templates.',
          icon: "SettingsAgreementTemplatesIcon",
          totalSettings: { count: 16, label: 'Templates' },
      },
      {
          title: 'Template Coverage',
          description: 'Manage services, assets, and coverage included in templates.',
          icon: "SettingsTemplateCoverageIcon",
          totalSettings: { count: 32, label: 'Coverages' },
      },
      {
          title: 'Template Pricing Components',
          description: 'Map pricing components to agreement templates.',
          icon: "SettingsTemplatePricingComponentsIcon",
          totalSettings: { count: 48, label: 'Mappings' },
      },
    ],

    assetsAndInventory: [
      {
          title: 'Asset Setup',
          description: 'Configure asset types, attributes, manufacturers, and defaults.',
          icon: "SettingsAssetSetupIcon",
          totalSettings: { count: 12, label: 'Asset Types' },
      },
      {
          title: 'Inventory Categories',
          description: 'Manage inventory categories and sub-categories.',
          icon: "SettingsInventoryCategoriesIcon",
          totalSettings: { count: 36, label: 'Categories' },
      },
      {
          title: 'Business Type Inventory Mapping',
          description: 'Associate business types with inventory categories.',
          icon: "SettingsBusinessTypeInventoryMappingIcon",
          totalSettings: { count: 18, label: 'Mappings' },
      },
      {
          title: 'Inventory Setup',
          description: 'Configure inventory settings, units, defaults, and behavior.',
          icon: "SettingsInventorySetupIcon",
          totalSettings: { count: 11, label: 'Settings' },
      },
    ],

    system: [
      {
          title: 'Email & SMS Templates',
          description: 'Create reusable email and SMS templates with system variables.',
          icon: "SettingsEmailSmsTemplatesIcon",
          totalSettings: { count: 34, label: 'Templates' },
      },
      {
          title: 'Notifications',
          description: 'Configure system notifications and alerts.',
          icon: "SettingsNotificationsIcon",
          totalSettings: { count: 9, label: 'Settings' },
      },
      {
          title: 'Integrations',
          description: 'Manage external systems and API integrations.',
          icon: "SettingsIntegrationsIcon",
          totalSettings: { count: 8, label: 'Integrations' },
      },
      {
          title: 'System Settings',
          description: 'Configure global application behavior and preferences.',
          icon: "SettingsSystemSettingsIcon",
          totalSettings: { count: 21, label: 'Settings' },
      },
      {
          title: 'Security Settings',
          description: 'Manage password, security, and access policies.',
          icon: "SettingsSecuritySettingsIcon",
          totalSettings: { count: 14, label: 'Settings' },
      },
      {
          title: 'Audit Logs',
          description: 'View system audit activity and history.',
          icon: "SettingsAuditLogsIcon",
          totalSettings: { count: 7, label: 'Log Types' },
      },
    ],

}