import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Our type scale is named rather than t-shirt sized (`text-control`, not `text-sm`),
 * because it comes from `--text-*` theme tokens. tailwind-merge only recognises the
 * t-shirt scale as font sizes, so it filed `text-control` alongside colours like
 * `text-brand-blue` in one conflict group and kept whichever came last. Layering a
 * colour over a size therefore deleted the size: an active nav row rendered with no
 * font-size utility at all and fell back to the inherited body size, which is why
 * selecting an item made it grow. Declaring the scale keeps size and colour
 * independent.
 *
 * `input` is absent on purpose. `--color-input` and `--text-input` both exist, and
 * Tailwind resolves `text-input` to the colour, so it is not a font size here.
 */
const FONT_SIZE_TOKENS = [
  'caption',
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
