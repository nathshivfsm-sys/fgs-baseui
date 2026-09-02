import { Typography, type TypographyProps } from '../typography-base';

/** Smallest heading, for compact form panels and grouped field sets. */
export function Heading4(props: TypographyProps) {
  return (
    <Typography
      as="h4"
      data-slot="heading-4"
      defaultColor="heading"
      variant="heading4"
      {...props}
    />
  );
}
