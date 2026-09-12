import { BodySmall, Callout } from '@cms/ui';

export function PostalCodePanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-start p-6">
      <Callout title="Postal codes" variant="info">
        <BodySmall color="foreground">
          The postal code catalog is not connected yet. Use Zones to manage
          service territories until that API is available.
        </BodySmall>
      </Callout>
    </div>
  );
}
