const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'long' });

/** Parse `YYYY-MM-DD` as a local calendar date so UTC offset cannot shift the day. */
const toLocalDate = (isoDate: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const pad = (value: number): string => String(value).padStart(2, '0');

/** Display date, `MM/DD/YYYY`. */
export const formatNonWorkingDate = (isoDate: string): string => {
  const date = toLocalDate(isoDate);
  if (!date) return isoDate;
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
};

export const weekdayName = (isoDate: string): string => {
  const date = toLocalDate(isoDate);
  return date ? WEEKDAY.format(date) : '—';
};
