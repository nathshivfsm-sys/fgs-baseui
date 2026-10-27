import { BodySmall, Button, PlusIcon } from '@cms/ui';
import {
  SETUP_SALES_LABEL,
  SETUP_SALES_TAB,
  SettingsPageTitle,
  SetupBreadcrumb,
} from '../../../shared';
import { PAGE_DESCRIPTION, PAGE_TITLE } from '../constant';
import type { SalesActivitiesHeaderProps } from '../types';

export const SalesActivitiesHeader = ({
  createLabel,
  onAdd,
}: SalesActivitiesHeaderProps) => {
  const handleAdd = () => {
    onAdd();
  };

  return (
    <header className="flex items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <SetupBreadcrumb
          moduleKey={SETUP_SALES_TAB}
          moduleLabel={SETUP_SALES_LABEL}
          pageLabel={PAGE_TITLE}
        />
        <SettingsPageTitle moduleKey={SETUP_SALES_TAB}>
          {PAGE_TITLE}
        </SettingsPageTitle>
        <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
      </div>
      <Button className="shrink-0" onClick={handleAdd} type="button">
        <PlusIcon className="size-3.5" />
        {createLabel}
      </Button>
    </header>
  );
};
