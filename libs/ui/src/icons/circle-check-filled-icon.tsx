import { createFigmaIcon } from './icon-base';

/** Filled status disc used by boolean grid cells. */
export const CircleCheckFilledIcon = createFigmaIcon(
  'CircleCheckFilledIcon',
  '0 0 18 18',
  <>
    <circle cx="9" cy="9" r="9" fill="currentColor" />
    <path
      d="M5.003 9 7.801 11.498 12.997 6.002"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.999"
    />
  </>,
);
