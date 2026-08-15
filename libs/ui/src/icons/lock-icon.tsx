import { createFigmaIcon } from './icon-base';

export const LockIcon = createFigmaIcon(
  'LockIcon',
  '0 0 22 22',
  <>
    <rect
      x="3"
      y="7"
      width="16"
      height="12"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M7 7V5a4 4 0 0 1 8 0v2M11 11v3"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
  </>,
);
