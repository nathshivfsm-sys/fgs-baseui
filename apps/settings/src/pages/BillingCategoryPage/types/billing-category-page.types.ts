import type { QueryClient } from '@tanstack/react-query';
import type { GloBillingCategoryTypeLookupDto } from '@cms/shared-contract';
import type { BillingCategorySummaryDto } from '@cms/settings-contract';
import type { BillingCategoryForm } from '@cms/settings-data-access';
import type { BillingCategoryListFilters } from './billing-category-list.types';

export interface BillingCategoryPageProps {
  queryClient: QueryClient;
}

export type BillingCategoryStatusFilter = 'active' | 'inactive';

export interface BillingCategoryFormDialogProps {
  billingCategory: BillingCategorySummaryDto | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BillingCategoryForm) => void;
  open: boolean;
  typeOptions: readonly GloBillingCategoryTypeLookupDto[] | undefined;
}

export interface BillingCategoryDeactivateDialogProps {
  billingCategory: BillingCategorySummaryDto | null;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export interface BillingCategoryListFilterProps {
  appliedFilters: BillingCategoryListFilters;
  onApply: (filters: BillingCategoryListFilters) => void;
  onClear: () => void;
  typeOptions: readonly GloBillingCategoryTypeLookupDto[] | undefined;
}

export interface BillingCategoryDiscardDialogProps {
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}
