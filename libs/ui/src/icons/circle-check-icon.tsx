import { createFigmaIcon } from './icon-base';

export const CircleCheckIcon = createFigmaIcon(
  'CircleCheckIcon',
  '0 0 20 20',
  <>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6.75 10.25 8.75 12.25 13.25 7.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </>,
);
