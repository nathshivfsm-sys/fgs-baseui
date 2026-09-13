const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatTaxRate(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${value} %`;
}

export function formatTripCharge(value: number | null | undefined): string {
  if (value == null) return '—';
  return currency.format(value);
}
