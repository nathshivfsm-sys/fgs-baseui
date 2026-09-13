import { BodySmall, Button, Heading3, TrashIcon } from '@cms/ui';
import { FormSection } from './FormSection';

const LOGO_SLOTS = ['Full Logo', 'Compact Logo'] as const;

/** UI only: no upload or remove behaviour yet. */
export const BrandingSection = () => (
  <FormSection title="Branding / Logo">
    {LOGO_SLOTS.map((slot) => (
      <div
        className="flex flex-col gap-3 rounded-lg border border-border-subtle p-4"
        key={slot}
      >
        <Heading3 className="text-control font-medium">{slot}</Heading3>
        <div className="flex h-20 items-center justify-center rounded-md border border-border-subtle bg-surface-sunken">
          <BodySmall color="foreground-muted">Logo</BodySmall>
        </div>
        <Button
          aria-label={`Upload / Change ${slot}`}
          size="sm"
          type="button"
          variant="surface"
        >
          Upload / Change
        </Button>
        <Button
          aria-label={`Remove ${slot}`}
          className="text-destructive"
          size="sm"
          type="button"
          variant="surface"
        >
          <TrashIcon aria-hidden className="size-4" />
          Remove
        </Button>
      </div>
    ))}
  </FormSection>
);
