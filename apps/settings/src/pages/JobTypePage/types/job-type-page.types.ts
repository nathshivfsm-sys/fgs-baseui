import type { CategoryIconTone, SubcategoryPriority } from './catalog.types';

export interface CategoryListEntry {
  code?: string;
  iconTone: CategoryIconTone;
  id: string;
  inactive?: boolean;
  name: string;
  subcategoryCount?: number;
}

export interface SubcategoryRow {
  categoryId: string;
  estimatedTime: string;
  id: string;
  isActive: boolean;
  priority: SubcategoryPriority;
  subcategory: string;
  taskName: string;
  trade: string;
}
