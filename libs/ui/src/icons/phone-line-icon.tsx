import { createFigmaIcon } from './icon-base';

/**
 * Leading icon for the identifier input's mobile-number field. Distinct glyph
 * from `PhoneIcon` (a filled handset used elsewhere) — this one traces the
 * Login design's own outline mark, so it is kept as a separate icon rather
 * than reusing `PhoneIcon`.
 */
export const PhoneLineIcon = createFigmaIcon(
  'PhoneLineIcon',
  '0 0 16 16',
  <>
    <path
      d="M2.99927 3.49915C2.99927 3.49915 3.49915 7.99805 5.99854 10.4974C8.49793 12.9968 12.497 12.9968 12.497 12.9968"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.4"
    />
    <path
      d="M2.99927 3.49915L5.99854 4.99878L5.49866 7.49817L6.99829 8.99781L9.49768 8.49793L10.9973 11.4972L8.99781 12.497C5.99854 12.9968 2.99927 9.99756 2.99927 3.49915Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.3"
    />
  </>,
);
