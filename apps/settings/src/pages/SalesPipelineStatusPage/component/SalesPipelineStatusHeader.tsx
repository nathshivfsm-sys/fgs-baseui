import { BodySmall, Button, Heading1, PlusIcon } from '@cms/ui';
import {
  SETUP_SALES_LABEL,
  SETUP_SALES_TAB,
  SetupBreadcrumb,
} from '../../../shared';
import { CREATE_STATUS_LABEL, PAGE_DESCRIPTION, PAGE_TITLE } from '../constant';
import type { SalesPipelineStatusHeaderProps } from '../types';

export const SalesPipelineStatusHeader = ({
  onAdd,
}: SalesPipelineStatusHeaderProps) => {
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
        <Heading1 className="mt-2">{PAGE_TITLE}</Heading1>
        <BodySmall color="foreground-subtle">{PAGE_DESCRIPTION}</BodySmall>
      </div>
      <Button className="shrink-0" onClick={handleAdd} type="button">
        <PlusIcon className="size-3.5" />
        {CREATE_STATUS_LABEL}
      </Button>
    </header>
  );
};
