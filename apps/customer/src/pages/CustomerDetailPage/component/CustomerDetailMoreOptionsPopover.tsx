import {
  Button,
  MoreVerticalIcon,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '@cms/ui';
import {
  CREATE_NEW_LOCATION_LABEL,
  DEACTIVATE_CUSTOMER_LABEL,
  MORE_OPTION_LABEL,
  MORE_OPTIONS_PANEL_TITLE,
} from '../constant';
import type { CustomerDetailMoreOptionsPopoverProps } from '../types';

export const CustomerDetailMoreOptionsPopover = ({
  onCreateNewLocation,
  onDeactivateCustomer,
}: CustomerDetailMoreOptionsPopoverProps) => {
  const handleDeactivateCustomer = () => {
    onDeactivateCustomer?.();
  };

  const handleCreateNewLocation = () => {
    onCreateNewLocation?.();
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className="h-[2.375rem] gap-2 border-[#1f54c8] px-4 text-[#1f54c8] hover:bg-action-subtle"
            type="button"
            variant="outline"
          >
            {MORE_OPTION_LABEL}
            <MoreVerticalIcon className="size-4 shrink-0" />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-56 gap-0 p-5" sideOffset={8}>
        <PopoverTitle className="text-body">
          {MORE_OPTIONS_PANEL_TITLE}
        </PopoverTitle>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-control marker:text-action">
          <li>
            <button
              className="text-action underline-offset-2 hover:underline"
              onClick={handleDeactivateCustomer}
              type="button"
            >
              {DEACTIVATE_CUSTOMER_LABEL}
            </button>
          </li>
          <li>
            <button
              className="text-action underline-offset-2 hover:underline"
              onClick={handleCreateNewLocation}
              type="button"
            >
              {CREATE_NEW_LOCATION_LABEL}
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
