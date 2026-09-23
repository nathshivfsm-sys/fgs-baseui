import type { CategoryListEntry } from './job-type-page.types';

export interface CategoryListItemProps {
  entry: CategoryListEntry;
  onEdit: (categoryId: string) => void;
  onSelect: (categoryId: string) => void;
  selected: boolean;
}
