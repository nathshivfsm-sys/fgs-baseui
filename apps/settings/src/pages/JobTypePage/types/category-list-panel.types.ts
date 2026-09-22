import type { CategoryListEntry } from './job-type-page.types';

export interface CategoryListPanelProps {
  addLabel: string;
  categories: readonly CategoryListEntry[];
  onAdd: () => void;
  onCategoryEdit: (categoryId: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchValue: string;
  selectedCategoryId: string | null;
  title: string;
}
