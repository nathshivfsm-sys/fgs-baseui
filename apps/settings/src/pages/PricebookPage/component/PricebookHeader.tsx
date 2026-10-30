import { BodySmall, Button, PlusIcon } from '@cms/ui';
import {
  SETUP_BILLING_LABEL,
  SETUP_BILLING_TAB,
  SettingsPageTitle,
  SetupBreadcrumb,
} from '../../../shared';
import {
  CREATE_PRICEBOOK_LABEL,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from '../constant';
import type { PricebookHeaderProps } from '../types';

export const PricebookHeader = ({ onAdd }: PricebookHeaderProps) => {
  const handleAdd = () => {
    onAdd();
  };

  return (
    <header className="flex items-end justify-between gap-4 border-b border-border pb-4">
      <div className="min-w-0">
        <SetupBreadcrumb
          moduleKey={SETUP_BILLING_TAB}
          moduleLabel={SETUP_BILLING_LABEL}
          pageLabel={PAGE_TITLE}
        />
        <SettingsPageTitle moduleKey={SETUP_BILLING_TAB}>
          {PAGE_TITLE}
        </SettingsPageTitle>
        <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
      </div>
      <Button className="shrink-0" onClick={handleAdd} type="button">
        <PlusIcon className="size-3.5" />
        {CREATE_PRICEBOOK_LABEL}
      </Button>
    </header>
  );
};
