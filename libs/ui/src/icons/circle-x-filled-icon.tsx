import { createFigmaIcon } from './icon-base';

/** Filled status disc used by boolean grid cells. */
export const CircleXFilledIcon = createFigmaIcon(
  'CircleXFilledIcon',
  '0 0 18 18',
  <>
    <circle cx="9" cy="9" r="9" fill="currentColor" />
    <path
      d="M6.3 6.3 9 9m0 0 2.7 2.7M9 9l2.7-2.7M9 9 6.3 11.7"
      stroke="white"
      strokeLinecap="round"
      strokeWidth="1.62"
    />
  </>,
);
