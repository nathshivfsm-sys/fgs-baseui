import { CircleXIcon, DocumentEditIcon, LeadIcon, PhoneIcon } from '@cms/ui';
import { CatalogNavCard } from '../../../shared';
import { DESCRIPTION_TYPE_NAV } from '../constant';
import type { StandardDescriptionTypeNavPanelProps } from '../types';
import { findDescriptionTypeLabel } from '../util';

const iconForType = (code: string) => {
  switch (code) {
    case 'REASON_FOR_CALL':
      return {
        icon: <PhoneIcon className="size-4" />,
        iconClassName: 'bg-action-subtle text-action',
      };
    case 'WORK_DESCRIPTION':
      return {
        icon: <DocumentEditIcon className="size-4" />,
        iconClassName: 'bg-data-4 text-data-4-foreground',
      };
    case 'CANCELLATION_REASON':
      return {
        icon: <CircleXIcon className="size-4" />,
        iconClassName: 'bg-data-3 text-data-3-foreground',
      };
    case 'LEAD_DISQUALIFICATION':
      return {
        icon: <LeadIcon className="size-4" />,
        iconClassName: 'bg-data-2 text-data-2-foreground',
      };
    default:
      return {
        icon: <DocumentEditIcon className="size-4" />,
        iconClassName: 'bg-action-subtle text-action',
      };
  }
};

export const StandardDescriptionTypeNavPanel = ({
  activeCountsByType,
  inactiveCountsByType,
  onTypeChange,
  selectedTypeCode,
  typeOptions,
}: StandardDescriptionTypeNavPanelProps) => {
  const handleSelect = (code: string) => {
    onTypeChange(code);
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border bg-secondary/40 p-5 lg:w-[16.25rem] lg:border-r lg:border-b-0">
      {DESCRIPTION_TYPE_NAV.map((item) => {
        const { icon, iconClassName } = iconForType(item.code);
        const handleClick = () => {
          handleSelect(item.code);
        };

        return (
          <CatalogNavCard
            activeCount={activeCountsByType[item.code]}
            description={item.description}
            icon={icon}
            iconClassName={iconClassName}
            inactiveCount={inactiveCountsByType[item.code]}
            key={item.code}
            onSelect={handleClick}
            selected={selectedTypeCode === item.code}
            title={findDescriptionTypeLabel(item.code, typeOptions)}
          />
        );
      })}
    </aside>
  );
};
