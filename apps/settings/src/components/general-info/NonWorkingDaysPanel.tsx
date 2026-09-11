import { useId } from 'react';
import {
  BodySmall,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  IconButton,
  PlusIcon,
  SectionTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TrashIcon,
} from '@cms/ui';
import { NON_WORKING_DAYS_PREVIEW } from '../../constants/non-working-days';

/** UI only: static rows from the design, with no add, edit, delete or paging yet. */
export function NonWorkingDaysPanel() {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionTitle id={titleId} size="sm">
            Non-Working Days
          </SectionTitle>
          <BodySmall color="foreground-subtle">
            Define company holidays and non working days.
          </BodySmall>
        </div>
        <Button size="sm" type="button" variant="subtle">
          <PlusIcon aria-hidden className="size-4" />
          Add Non-Working Day
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {NON_WORKING_DAYS_PREVIEW.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.day}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <IconButton
                    className="text-action"
                    icon={<EditIcon className="size-4" />}
                    label={`Edit ${row.description}`}
                    size="xs"
                    type="button"
                    variant="ghost"
                  />
                  <IconButton
                    className="text-destructive"
                    icon={<TrashIcon className="size-4" />}
                    label={`Delete ${row.description}`}
                    size="xs"
                    type="button"
                    variant="ghost"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <nav
        aria-label="Non-working days pages"
        className="flex items-center justify-end gap-1"
      >
        <IconButton
          disabled
          icon={<ChevronLeftIcon className="size-4" />}
          label="Previous page"
          size="xs"
          type="button"
          variant="surface"
        />
        <Button aria-current="page" size="iconXs" type="button">
          1
        </Button>
        <IconButton
          disabled
          icon={<ChevronRightIcon className="size-4" />}
          label="Next page"
          size="xs"
          type="button"
          variant="surface"
        />
      </nav>
    </section>
  );
}
