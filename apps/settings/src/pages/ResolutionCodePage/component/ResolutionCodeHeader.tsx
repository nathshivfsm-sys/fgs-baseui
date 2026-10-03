import { BodySmall, Button, Heading1, PlusIcon } from '@cms/ui';
import {
  SETUP_OPERATIONS_LABEL,
  SETUP_OPERATIONS_TAB,
  SetupBreadcrumb,
} from '../../../shared';
import {
  ADD_RESOLUTION_CODE_LABEL,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from '../constant';
import type { ResolutionCodeHeaderProps } from '../types';

export const ResolutionCodeHeader = ({ onAdd }: ResolutionCodeHeaderProps) => {
  const handleAdd = () => {
    onAdd();
  };

  return (
    <header className="flex items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <SetupBreadcrumb
          moduleKey={SETUP_OPERATIONS_TAB}
          moduleLabel={SETUP_OPERATIONS_LABEL}
          pageLabel={PAGE_TITLE}
        />
        <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
        <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
      </div>
      <Button className="shrink-0" onClick={handleAdd} type="button">
        <PlusIcon className="size-3.5" />
        {ADD_RESOLUTION_CODE_LABEL}
      </Button>
    </header>
  );
};
