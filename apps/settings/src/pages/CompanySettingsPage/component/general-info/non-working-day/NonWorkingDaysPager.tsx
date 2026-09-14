import { Button, ChevronLeftIcon, ChevronRightIcon, IconButton } from '@cms/ui';
import type { NonWorkingDaysPagerProps } from '../../../types';

export const NonWorkingDaysPager = ({
  onNextPage,
  onPreviousPage,
  page,
  pageCount,
}: NonWorkingDaysPagerProps) => (
  <nav
    aria-label="Non-working days pages"
    className="flex items-center justify-end gap-1"
  >
    <IconButton
      disabled={page <= 1}
      icon={<ChevronLeftIcon className="size-4" />}
      label="Previous page"
      onClick={onPreviousPage}
      size="xs"
      type="button"
      variant="surface"
    />
    <Button aria-current="page" size="iconXs" type="button">
      {page}
    </Button>
    <IconButton
      disabled={page >= pageCount}
      icon={<ChevronRightIcon className="size-4" />}
      label="Next page"
      onClick={onNextPage}
      size="xs"
      type="button"
      variant="surface"
    />
  </nav>
);
