import { Typography, type TypographyProps } from '../typography-base';

/** Major section heading within a screen. */
export function Heading2(props: TypographyProps) {
  return (
    <Typography
      as="h2"
      data-slot="heading-2"
      defaultColor="heading"
      variant="heading2"
      {...props}
    />
  );
}
