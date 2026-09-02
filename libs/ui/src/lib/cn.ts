import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Our type scale is named rather than t-shirt sized (`text-control`, not `text-sm`),
 * because it comes from `--text-*` theme tokens. tailwind-merge only recognises the
 * t-shirt scale as font sizes, so it filed `text-control` alongside colours like
 * `text-primary` in one conflict group and kept whichever came last. Layering a
 * colour over a size therefore deleted the size: an active nav row rendered with no
 * font-size utility at all and fell back to the inherited body size, which is why
 * selecting an item made it grow. Declaring the scale keeps size and colour
 * independent.
 *
 * The 13px step is named `field`, not `input`. `--color-input` exists, so
 * Tailwind resolved `text-input` to the colour rather than the size. Because both
 * landed in the colour group, tailwind-merge deleted the size utility outright
 * and the element inherited its size instead. Renaming removed the ambiguity.
 */
const FONT_SIZE_TOKENS = [
  'caption',
  'field',
  'control',
  'body',
  'metric-value',
  'title',
  'tenant',
  'badge',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: FONT_SIZE_TOKENS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
