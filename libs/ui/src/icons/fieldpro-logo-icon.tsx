import { createFigmaIcon } from './icon-base';

/**
 * Brand mark, traced from the top-nav frame. Fixed brand colours rather than
 * `currentColor`: the disc reads as a lighter blue so the mark separates from
 * the `--topnav` bar it now sits on.
 */
export const FieldProLogoIcon = createFigmaIcon(
  'FieldProLogoIcon',
  '0 0 28 28',
  <>
    <path
      d="M14 27C21.1797 27 27 21.1797 27 14C27 6.8203 21.1797 1 14 1C6.8203 1 1 6.8203 1 14C1 21.1797 6.8203 27 14 27Z"
      fill="#3B82F6"
    />
    <path
      d="M8 14C8 10.7 10.7 8 14 8C17.3 8 20 10.7 20 14"
      stroke="white"
      strokeLinecap="round"
      strokeWidth="4"
    />
    <path
      d="M8 14C8 17.3 10.7 20 14 20"
      stroke="#60A5FA"
      strokeLinecap="round"
      strokeWidth="4"
    />
    <path
      d="M14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16Z"
      fill="white"
    />
  </>,
);
