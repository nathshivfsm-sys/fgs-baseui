export const formatPrice = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatQuantity = (value: number) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const parsePriceInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const amount = Number(trimmed);
  return Number.isFinite(amount) ? amount : 0;
};
