import {
  DocumentEditIcon,
  IconButton,
  SettingsBillingCategoryIcon,
  cn,
} from '@cms/ui';
import type { CategoryListEntry, CategoryListItemProps } from '../types';

const iconToneClass: Record<CategoryListEntry['iconTone'], string> = {
  blue: 'bg-data-1 text-data-1-foreground',
  red: 'bg-destructive/10 text-destructive-strong',
  green: 'bg-data-2 text-data-2-foreground',
  orange: 'bg-data-3 text-data-3-foreground',
  indigo: 'bg-data-4 text-data-4-foreground',
  pink: 'bg-data-4/60 text-data-4-foreground',
  amber: 'bg-warning/80 text-warning-foreground',
};

export function CategoryListItem({
  entry,
  onEdit,
  onSelect,
  selected,
}: CategoryListItemProps) {
  const handleSelect = () => {
    onSelect(entry.id);
  };

  const handleEdit = () => {
    onEdit(entry.id);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b border-border-subtle px-3.5 py-2.5',
        entry.inactive && 'bg-secondary/80',
        selected &&
          'border-l-[3px] border-l-action border-b-action-subtle bg-action-subtle',
        !selected && !entry.inactive && 'border-l-[3px] border-l-transparent',
      )}
    >
      <button
        aria-current={selected ? 'true' : undefined}
        className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
        onClick={handleSelect}
        type="button"
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex size-[2.125rem] shrink-0 items-center justify-center rounded-lg',
            iconToneClass[entry.iconTone],
          )}
        >
          <SettingsBillingCategoryIcon className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={cn(
              'block truncate text-field font-semibold leading-snug',
              selected ? 'text-action' : 'text-heading',
              entry.inactive && !selected && 'text-foreground-muted',
            )}
          >
            {entry.name}
          </span>
          {entry.code ? (
            <span className="block truncate text-[0.6875rem] font-medium leading-snug text-foreground-muted">
              {entry.code}
            </span>
          ) : null}
        </span>
        {entry.subcategoryCount != null ? (
          <span className="shrink-0 text-caption font-semibold text-foreground-muted">
            {entry.subcategoryCount}
          </span>
        ) : null}
      </button>
      <IconButton
        className="shrink-0 rounded-md"
        icon={<DocumentEditIcon className="size-3.5" />}
        label={`Edit ${entry.name}`}
        onClick={handleEdit}
        size="xs"
        variant="outline"
      />
    </div>
  );
}
