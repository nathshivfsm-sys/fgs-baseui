import type { QueryClient } from '@tanstack/react-query';
import type { JobCategorySummaryDto } from '@cms/settings-contract';
import type {
  JobCategoryForm,
  SubcategoryForm,
} from '@cms/settings-data-access';
import type { SelectOption } from '@cms/ui';
import type { SubcategorySummaryDto } from '@cms/settings-contract';

export interface JobTypePageProps {
  queryClient: QueryClient;
}

export interface JobCategoryCatalogProps {
  categories: readonly JobCategorySummaryDto[];
  isError: boolean;
  isPending: boolean;
  loadError: unknown;
  queryClient: QueryClient;
}

export interface CategoryFormDialogProps {
  category: JobCategorySummaryDto | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: JobCategoryForm) => void;
  open: boolean;
}

export interface SubcategoryFormDialogProps {
  categoryName: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SubcategoryForm) => void;
  open: boolean;
  record: SubcategorySummaryDto | null;
  skillOptions: readonly SelectOption[];
  tradeOptions: readonly SelectOption[];
}
