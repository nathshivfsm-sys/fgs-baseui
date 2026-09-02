import { Typography, type TypographyProps } from '../typography-base';

/** Default running text. */
export function Body(props: TypographyProps) {
  return <Typography as="p" data-slot="body" variant="body" {...props} />;
}
