import { createFigmaIcon } from './icon-base';

/**
 * Brand mark for the public-page banner, traced from the Login frame's
 * `HexLogo`. Fixed white fills rather than `currentColor`, matching
 * `FieldProLogoIcon`'s precedent — it is only ever placed on the banner's
 * `--brand-blue` background.
 */
export const HexLogoIcon = createFigmaIcon(
  'HexLogoIcon',
  '0 0 52 58',
  <>
    <path
      d="M25.9961 1.9996L48.9915 14.4971V41.4916L25.9961 53.9891L3.00074 41.4916V14.4971L25.9961 1.9996Z"
      fill="white"
      fillOpacity="0.15"
      stroke="white"
      strokeWidth="1.5"
    />
    <path
      d="M18.9975 24.995C18.9975 21.1297 22.1309 17.9964 25.9961 17.9964C29.8613 17.9964 32.9947 21.1297 32.9947 24.995H18.9975Z"
      fill="white"
    />
    <path
      d="M33.7445 24.995H18.2477C17.5574 24.995 16.9979 25.5545 16.9979 26.2447C16.9979 26.9349 17.5574 27.4945 18.2477 27.4945H33.7445C34.4348 27.4945 34.9943 26.9349 34.9943 26.2447C34.9943 25.5545 34.4348 24.995 33.7445 24.995Z"
      fill="white"
    />
    <path
      d="M19.9973 29.9939H31.9949L33.4946 36.9925H18.4976L19.9973 29.9939Z"
      fill="white"
    />
    <path
      d="M31.9949 19.9966L34.9949 16.9966"
      opacity="0.55"
      stroke="white"
      strokeLinecap="round"
      strokeWidth="1.4"
    />
  </>,
);
