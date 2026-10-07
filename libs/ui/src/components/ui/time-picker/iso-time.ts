const ISO_TIME = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export const padTimeUnit = (value: number): string =>
  String(value).padStart(2, '0');

export const parseIsoTime = (
  value: string,
): { hours: number; minutes: number } | undefined => {
  const match = ISO_TIME.exec(value.trim());
  if (!match) return undefined;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return undefined;
  return { hours, minutes };
};

/** Form and wire clock value as `HH:mm` (24-hour). */
export const formatIsoTime = (hours: number, minutes: number): string =>
  `${padTimeUnit(hours)}:${padTimeUnit(minutes)}`;

const displayLocale =
  typeof navigator !== 'undefined' && navigator.language
    ? navigator.language
    : 'en-US';

/** Locale-aware display for picker triggers (e.g. 9:30 AM). */
export const formatIsoTimeDisplay = (value: string): string => {
  const parsed = parseIsoTime(value);
  if (!parsed) return value.trim();
  const date = new Date(2000, 0, 1, parsed.hours, parsed.minutes);
  return new Intl.DateTimeFormat(displayLocale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const isValidIsoTime = (value: string): boolean =>
  parseIsoTime(value) !== undefined;

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) =>
  padTimeUnit(hour),
);

export const minuteOptionsForStep = (minuteStep: number): string[] => {
  const step = Math.max(1, Math.min(30, minuteStep));
  const options: string[] = [];
  for (let minute = 0; minute < 60; minute += step) {
    options.push(padTimeUnit(minute));
  }
  return options;
};
