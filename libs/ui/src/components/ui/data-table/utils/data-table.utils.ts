import type { RowData } from '@tanstack/react-table';
import type {
  DataTableColumnMeta,
  DataTableRowActivationEvent,
  DataTableStatus,
  PageItem,
} from '../types';

const alignClasses = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
} as const;

export function getDataTableAlignClass(align: DataTableColumnMeta['align']) {
  return align ? alignClasses[align] : undefined;
}

export function isInteractiveTarget(
  target: EventTarget | null,
  currentTarget: HTMLElement,
) {
  if (!(target instanceof Element)) return false;

  const interactiveElement = target.closest(
    'a, button, input, select, textarea, [role="button"], [role="link"], [role="menuitem"], [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
  );

  return interactiveElement != null && interactiveElement !== currentTarget;
}

export function activateDataTableRow<TData extends RowData>(
  event: DataTableRowActivationEvent,
  row: TData,
  onActivate?: (row: TData) => void,
) {
  if (!onActivate || isInteractiveTarget(event.target, event.currentTarget)) {
    return;
  }

  if ('key' in event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
  }

  onActivate(row);
}
export function buildPageItems(
  pageCount: number,
  pageIndex: number,
  siblingCount = 1,
): PageItem[] {
  const boundaryCount = 1;
  const maxSlots = boundaryCount * 2 + siblingCount * 2 + 3;

  if (pageCount <= maxSlots) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const windowSize = siblingCount * 2 + 1;
  let left = Math.max(pageIndex - siblingCount, boundaryCount);
  let right = Math.min(pageIndex + siblingCount, pageCount - 1 - boundaryCount);

  if (right - left + 1 < windowSize) {
    if (pageIndex < pageCount / 2) {
      right = Math.min(left + windowSize - 1, pageCount - 1 - boundaryCount);
    } else {
      left = Math.max(right - windowSize + 1, boundaryCount);
    }
  }

  const items: PageItem[] = [0];
  if (left > boundaryCount) items.push('ellipsis-start');
  for (let page = left; page <= right; page += 1) items.push(page);
  if (right < pageCount - 1 - boundaryCount) items.push('ellipsis-end');
  items.push(pageCount - 1);

  return items;
}

export function getDataTableStatusMessage(
  status: DataTableStatus,
  rowLabel: string,
  rowCount: number,
) {
  switch (status) {
    case 'loading':
      return `Loading ${rowLabel}.`;
    case 'refetching':
      return `Updating ${rowLabel}.`;
    case 'error':
      return `Unable to load ${rowLabel}.`;
    default:
      return `${rowCount} ${rowLabel}.`;
  }
}
