import type { CategoryIconTone, SubcategoryPriority } from './catalog.types';

export interface CategoryListEntry {
  backgroundColor?: string | null;
  code?: string;
  iconTone: CategoryIconTone;
  id: string;
  inactive?: boolean;
  name: string;
  subcategoryCount?: number;
  textColor?: string | null;
}

export interface SubcategoryRow {
  categoryId: string;
  estimatedTime: string;
  id: string;
  isActive: boolean;
  priority: SubcategoryPriority | string;
  skill?: string;
  subcategory: string;
  taskName: string;
  trade: string;
}
