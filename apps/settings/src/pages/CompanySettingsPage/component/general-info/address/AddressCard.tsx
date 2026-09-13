import { BodySmall, Button, Heading3, LocationPinIcon } from '@cms/ui';
import type { AddressCardProps } from '../../../types';
import { formatAddress } from '../../../util';

export const AddressCard = ({ address, onEdit, title }: AddressCardProps) => {
  const lines = address ? formatAddress(address) : [];
  return (
    <div className="rounded-lg border border-border-subtle p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LocationPinIcon aria-hidden className="size-4 text-icon-muted" />
          <Heading3 className="text-control font-medium">{title}</Heading3>
        </div>
        <Button
          aria-label={`Edit ${title}`}
          onClick={onEdit}
          size="sm"
          type="button"
          variant="outline"
        >
          Edit
        </Button>
      </div>
      {lines.length > 0 ? (
        <address className="not-italic">
          {lines.map((line) => (
            <BodySmall color="foreground-subtle" key={line}>
              {line}
            </BodySmall>
          ))}
        </address>
      ) : (
        <BodySmall color="foreground-subtle">No address on file</BodySmall>
      )}
    </div>
  );
};
