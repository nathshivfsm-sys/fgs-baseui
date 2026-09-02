import { Typography, type TypographyProps } from '../typography-base';

/** Secondary running text: descriptions, helper copy, metadata. */
export function BodySmall(props: TypographyProps) {
  return (
    <Typography as="p" data-slot="body-small" variant="bodySmall" {...props} />
  );
}
