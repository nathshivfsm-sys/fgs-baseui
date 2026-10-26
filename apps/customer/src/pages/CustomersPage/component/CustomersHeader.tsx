import { BodySmall, Button, Heading1, PlusIcon } from '@cms/ui';
import {
  ADD_CUSTOMER_LABEL,
  CUSTOMERS_PAGE_SUBTITLE,
  CUSTOMERS_PAGE_TITLE,
} from '../constant';

export interface CustomersHeaderProps {
  onAdd: () => void;
}

export const CustomersHeader = ({ onAdd }: CustomersHeaderProps) => {
  const handleAddClick = () => {
    onAdd();
  };

  return (
    <header className="flex flex-wrap items-start justify-between gap-3 px-0 pb-1">
      <div>
        <Heading1>{CUSTOMERS_PAGE_TITLE}</Heading1>
        <BodySmall color="foreground-subtle">
          {CUSTOMERS_PAGE_SUBTITLE}
        </BodySmall>
      </div>
      <Button className="shrink-0" onClick={handleAddClick} type="button">
        <PlusIcon className="size-3.5" />
        {ADD_CUSTOMER_LABEL}
      </Button>
    </header>
  );
};
