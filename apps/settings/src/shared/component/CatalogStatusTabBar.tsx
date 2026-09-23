import {
  Button,
  DataTableSearch,
  FilterIcon,
  PlusIcon,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@cms/ui';
import type {
  CatalogStatusFilter,
  CatalogStatusTabBarProps,
} from '../types';

export const CatalogStatusTabBar = ({
  activeCount,
  addLabel,
  inactiveCount,
  onAdd,
  onFilterClick,
  onSearchChange,
  onStatusChange,
  searchPlaceholder = 'Search...',
  searchValue,
  status,
}: CatalogStatusTabBarProps) => {
  const handleStatusChange = (next: string) => {
    onStatusChange(next as CatalogStatusFilter);
  };

  const handleFilterClick = () => {
    onFilterClick?.();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-6">
      <Tabs className="self-end" onValueChange={handleStatusChange} value={status}>
        <TabsList>
          <TabsTrigger size="default" tone="action" value="active">
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger size="default" tone="action" value="inactive">
            Inactive ({inactiveCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex min-w-0 items-center justify-end gap-2 py-2">
        {onSearchChange ? (
          <DataTableSearch
            className="w-44 sm:w-56"
            label={searchPlaceholder}
            onValueChange={onSearchChange}
            placeholder={searchPlaceholder}
            value={searchValue ?? ''}
          />
        ) : null}
        {onFilterClick ? (
          <Button
            className="shrink-0"
            onClick={handleFilterClick}
            type="button"
            variant="outline"
          >
            <FilterIcon className="size-3.5" />
            Filter
          </Button>
        ) : null}
        <Button className="shrink-0" onClick={onAdd} type="button">
          <PlusIcon className="size-3.5" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
};
