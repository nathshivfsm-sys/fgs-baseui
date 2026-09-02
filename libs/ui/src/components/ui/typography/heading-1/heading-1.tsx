import { Typography, type TypographyProps } from '../typography-base';

/** Screen title, one per view — e.g. "Business Units & Break 2". */
export function Heading1(props: TypographyProps) {
  return (
    <Typography
      as="h1"
      data-slot="heading-1"
      defaultColor="heading"
      variant="heading1"
      {...props}
    />
  );
}
