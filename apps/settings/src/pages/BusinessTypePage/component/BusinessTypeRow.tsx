import { BodySmall, Switch } from '@cms/ui';
import { ACTIVE_LABEL, INACTIVE_LABEL } from '../constant';
import type { BusinessTypeRowProps } from '../types';
import { BusinessTypeMark } from './BusinessTypeMark';

export const BusinessTypeRow = ({
  enabling,
  onEnable,
  record,
}: BusinessTypeRowProps) => {
  const turnedOn = record.isActive || enabling;
  const label = record.name ?? record.code ?? 'Business type';
  const locked = record.isActive || enabling;

  const handleCheckedChange = (checked: boolean) => {
    if (!checked || locked) return;
    onEnable(record);
  };

  return (
    <li className="flex items-center gap-3 border-b border-[#f3f4f6] px-3.5 py-[11px]">
      <BusinessTypeMark code={record.code} name={record.name} />
      <p className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-[19.5px] text-heading">
        {label}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Switch
          aria-disabled={locked || undefined}
          aria-label={label}
          checked={turnedOn}
          className={locked ? 'pointer-events-none' : undefined}
          onCheckedChange={handleCheckedChange}
        />
        <BodySmall>{turnedOn ? ACTIVE_LABEL : INACTIVE_LABEL}</BodySmall>
      </div>
    </li>
  );
};
