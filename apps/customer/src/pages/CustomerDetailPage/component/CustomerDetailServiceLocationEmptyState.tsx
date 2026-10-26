import { BuildingIcon, Button, PlusIcon } from '@cms/ui';
import {
  SERVICE_LOCATION_ADD_LABEL,
  SERVICE_LOCATION_EMPTY_MESSAGE,
  SERVICE_LOCATION_SECTION_TITLE,
} from '../constant';
import type { CustomerDetailServiceLocationEmptyStateProps } from '../types';

export const CustomerDetailServiceLocationEmptyState = ({
  onAddLocation,
}: CustomerDetailServiceLocationEmptyStateProps) => {
  const handleAddLocation = () => {
    onAddLocation();
  };

  return (
    <section
      className="relative flex min-h-[16rem] flex-col overflow-hidden rounded-lg border border-[#f7f7f7] bg-surface shadow-[4px_4px_64px_16px_rgba(0,0,0,0.02)]"
      data-testid="customer-service-locations-empty"
    >
      <h2 className="px-5 pt-4 text-lg font-bold text-heading">
        {SERVICE_LOCATION_SECTION_TITLE}
      </h2>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-5 pb-8 pt-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <BuildingIcon aria-hidden className="size-10 text-[#9fa5b2]" />
          <p className="text-lg font-medium text-[#828a9b]">
            {SERVICE_LOCATION_EMPTY_MESSAGE}
          </p>
        </div>
        <Button
          className="border-[#3538bf] bg-[#f0f6fc] text-[#3538bf] hover:bg-[#f0f6fc]"
          onClick={handleAddLocation}
          type="button"
          variant="outline"
        >
          <PlusIcon className="size-4" />
          {SERVICE_LOCATION_ADD_LABEL}
        </Button>
      </div>
    </section>
  );
};
