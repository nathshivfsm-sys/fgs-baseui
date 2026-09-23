import { formatLocaleCurrency } from '@cms/shared-locale';

export function formatTaxRate(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${value} %`;
}

export function formatTripCharge(value: number | null | undefined): string {
  if (value == null) return '—';
  const formatted = formatLocaleCurrency(value);
  return formatted || '—';
}
