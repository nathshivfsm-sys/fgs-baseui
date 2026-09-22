import {
  Body,
  Button,
  DataTableSearch,
  FilterIcon,
  IconButton,
  PlusIcon,
  ScrollArea,
} from '@cms/ui';
import type { CategoryListPanelProps } from '../types';
import { CategoryListItem } from './CategoryListItem';

export function CategoryListPanel({
  addLabel,
  categories,
  onAdd,
  onCategoryEdit,
  onCategorySelect,
  onSearchChange,
  searchPlaceholder,
  searchValue,
  selectedCategoryId,
  title,
}: CategoryListPanelProps) {
  const handleFilterClick = () => {
    // Placeholder until filter criteria are defined in the API spec.
  };

  return (
    <div className="flex w-full shrink-0 flex-col border-b border-border bg-surface lg:w-[20rem] lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3.5">
        <Body bold className="text-control leading-snug" color="heading">
          {title}
        </Body>
        <Button onClick={onAdd} type="button">
          <PlusIcon className="size-3.5" />
          {addLabel}
        </Button>
      </div>
      <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2.5">
        <DataTableSearch
          className="min-w-0 flex-1"
          label={searchPlaceholder}
          onValueChange={onSearchChange}
          placeholder={searchPlaceholder}
          value={searchValue}
        />
        <IconButton
          className="shrink-0 rounded-md"
          icon={<FilterIcon className="size-3.5" />}
          label="Filter categories"
          onClick={handleFilterClick}
          size="xs"
          variant="outline"
        />
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div role="list">
          {categories.map((entry) => (
            <CategoryListItem
              entry={entry}
              key={entry.id}
              onEdit={onCategoryEdit}
              onSelect={onCategorySelect}
              selected={entry.id === selectedCategoryId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
