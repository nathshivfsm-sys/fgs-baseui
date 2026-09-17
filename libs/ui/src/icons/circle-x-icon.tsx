import { createFigmaIcon } from './icon-base';

export const CircleXIcon = createFigmaIcon(
  'CircleXIcon',
  '0 0 20 20',
  <>
    <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="m7.5 7.5 5 5M12.5 7.5l-5 5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </>,
);
