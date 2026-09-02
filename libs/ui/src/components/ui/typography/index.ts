export * from './body';
export * from './body-small';
export * from './heading-1';
export * from './heading-2';
export * from './heading-3';
export * from './heading-4';
// Shared styles and types only. The `Typography` renderer behind the levels
// stays internal to this folder so the level components remain the public API.
export { typographyVariants } from './typography-base';
export type {
  TypographyColor,
  TypographyProps,
  TypographyVariant,
} from './typography-base';
