import { BodySmall, Button, PlusIcon, SectionTitle } from '@cms/ui';
import { ADD_LABEL, PANEL_DESCRIPTION, PANEL_TITLE } from '../../../constant';
import type { NonWorkingDaysHeaderProps } from '../../../types';

export const NonWorkingDaysHeader = ({
  onAdd,
  titleId,
}: NonWorkingDaysHeaderProps) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div className="min-w-0 flex-1">
      <SectionTitle id={titleId} size="sm">
        {PANEL_TITLE}
      </SectionTitle>
      <BodySmall color="foreground-subtle">{PANEL_DESCRIPTION}</BodySmall>
    </div>
    <Button
      className="shrink-0"
      onClick={onAdd}
      size="sm"
      type="button"
      variant="subtle"
    >
      <PlusIcon aria-hidden className="size-4" />
      {ADD_LABEL}
    </Button>
  </div>
);
