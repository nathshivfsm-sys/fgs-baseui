import type { FigmaIconProps } from '@cms/ui';
import {
  AgreementIcon,
  BriefcaseIcon,
  CapacityIcon,
  DashboardIcon,
  DispatchBoardIcon,
  EstimateIcon,
  HomeIcon,
  InvoiceIcon,
  LeadIcon,
  PaymentIcon,
  PinIcon,
  ProjectsIcon,
  PurchaseIcon,
  RefundIcon,
  ReportIcon,
  ReturnIcon,
  ScheduleIcon,
  UsersIcon,
  VendorIcon,
} from '@cms/ui';
import type { ComponentType } from 'react';

export interface NavItem {
  icon: ComponentType<FigmaIconProps>;
  label: string;
  path: string;
}

export interface NavSection {
  items: readonly NavItem[];
  label: string;
}

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { icon: HomeIcon, label: 'Today', path: '/today' },
  { icon: DashboardIcon, label: 'Dashboard', path: '/dashboard' },
  { icon: BriefcaseIcon, label: 'Work Orders', path: '/workorders' },
  { icon: DispatchBoardIcon, label: 'Dispatch Board', path: '/dispatch-board' },
  { icon: UsersIcon, label: 'Customers', path: '/customers' },
  { icon: PinIcon, label: 'Service Locations', path: '/service-locations' },
];

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    label: 'Sales',
    items: [
      { icon: LeadIcon, label: 'Lead', path: '/leads' },
      { icon: InvoiceIcon, label: 'Invoice', path: '/invoice' },
      { icon: EstimateIcon, label: 'Estimate', path: '/estimates' },
      {
        icon: AgreementIcon,
        label: 'Service Agreements',
        path: '/service-agreements',
      },
    ],
  },
  {
    label: 'Work',
    items: [
      {
        icon: CapacityIcon,
        label: 'Capacity Planning',
        path: '/capacity-planning',
      },
      { icon: ProjectsIcon, label: 'Projects', path: '/projects' },
    ],
  },
  {
    label: 'Payments',
    items: [
      { icon: PaymentIcon, label: 'Payments', path: '/payments' },
      {
        icon: ScheduleIcon,
        label: 'Schedule Payment',
        path: '/schedule-payment',
      },
      { icon: RefundIcon, label: 'Refunds', path: '/refunds' },
    ],
  },
  {
    label: 'Purchase',
    items: [
      {
        icon: PurchaseIcon,
        label: 'Purchase Orders',
        path: '/purchase-orders',
      },
      { icon: ReturnIcon, label: 'Returns', path: '/returns' },
      { icon: VendorIcon, label: 'Vendors', path: '/vendors' },
    ],
  },
  {
    label: 'Reports',
    items: [{ icon: ReportIcon, label: 'Reports', path: '/reports' }],
  },
];

export interface FlatNavRoute {
  label: string;
  path: string;
  section?: string;
}

export const ALL_NAV_ROUTES: readonly FlatNavRoute[] = [
  ...PRIMARY_NAV_ITEMS.map(({ label, path }) => ({ label, path })),
  ...NAV_SECTIONS.flatMap((section) =>
    section.items.map(({ label, path }) => ({
      label,
      path,
      section: section.label,
    })),
  ),
];
