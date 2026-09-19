import { createFigmaIcon } from './icon-base';

export const InfoCircleIcon = createFigmaIcon(
  'InfoCircleIcon',
  '0 0 20 20',
  <>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 9.25V13.5M10 6.5h.01"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </>,
);
