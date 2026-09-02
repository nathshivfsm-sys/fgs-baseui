import { Typography, type TypographyProps } from '../typography-base';

/** Panel or card heading. */
export function Heading3(props: TypographyProps) {
  return (
    <Typography
      as="h3"
      data-slot="heading-3"
      defaultColor="heading"
      variant="heading3"
      {...props}
    />
  );
}
