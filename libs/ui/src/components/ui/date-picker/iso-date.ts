const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value: number): string => String(value).padStart(2, '0');

/** Parse `YYYY-MM-DD` as a local calendar date so UTC offset cannot shift the day. */
export const parseIsoDate = (isoDate: string): Date | undefined => {
  const match = ISO_DATE.exec(isoDate.trim());
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

/** Format a local calendar date as `YYYY-MM-DD` for wire fields and form state. */
export const formatIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const startOfLocalDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Display date as `MM/DD/YYYY`, matching other Setup date fields. */
export const formatIsoDateDisplay = (isoDate: string): string => {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
};

export const isFutureLocalDay = (date: Date): boolean =>
  startOfLocalDay(date).getTime() > startOfLocalDay(new Date()).getTime();
